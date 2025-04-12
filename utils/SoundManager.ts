/**
 * Менеджер звуков для приложения
 */
class SoundManager {
  private isInitialized = false;
  private isMuted = false;
  private canVibrate = false;
  private timerBeepSound: HTMLAudioElement | null = null;
  private activeAudioElements: HTMLAudioElement[] = [];
  private soundPlaybackQueue: (() => void)[] = [];
  private isProcessingQueue = false;
  private isPlayingContinuously = false;
  private maxSimultaneousSounds = 2; // Ограничиваем количество одновременно воспроизводимых звуков
  private soundPath: string = '/sounds/timer-beep.mp3'; // Исправленный путь к звуку
  private isServer: boolean;

  constructor() {
    // Проверяем, запущен ли код на сервере или в браузере
    this.isServer = typeof window === 'undefined';
    
    // Инициализируем менеджер звуков только на клиенте
    if (!this.isServer) {
      this.initialize();
    }
  }

  /**
   * Проверка доступности браузерного API
   */
  private isBrowserEnv(): boolean {
    return !this.isServer && typeof window !== 'undefined';
  }

  /**
   * Инициализация менеджера звуков
   * @public - для обратной совместимости
   */
  public initialize() {
    // Не инициализируем на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Не инициализируем повторно
    if (this.isInitialized) return;

    // Проверяем поддержку вибрации
    this.canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

    // Загружаем звук для таймера
    this.loadTimerBeepSound();

    // Получаем настройки звука из локального хранилища
    try {
      if (typeof localStorage !== 'undefined') {
        const soundSettings = localStorage.getItem('soundSettings');
        if (soundSettings) {
          try {
            const { isMuted } = JSON.parse(soundSettings);
            this.isMuted = isMuted;
          } catch (e) {
            console.error('Error parsing sound settings:', e);
            this.isMuted = false;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }

    // Подготавливаем аудио к воспроизведению при взаимодействии пользователя
    const prepareAudio = () => {
      if (this.timerBeepSound && typeof document !== 'undefined') {
        // Добавляем обработчики ошибок
        this.timerBeepSound.addEventListener('error', (e) => {
          console.error('Error with audio playback:', e);
        });
        
        // Создаем временный обработчик для воспроизведения и приостановки звука
        const temporaryPlayHandler = () => {
          this.timerBeepSound?.play()
            .then(() => {
              // Немедленно приостанавливаем, нам нужно только разблокировать аудио
              this.timerBeepSound?.pause();
              
              // После успешного воспроизведения удаляем обработчик
              document.removeEventListener('click', temporaryPlayHandler);
              document.removeEventListener('touchstart', temporaryPlayHandler);
            })
            .catch(err => {
              console.warn('Could not prepare audio:', err);
              // Оставляем обработчик, чтобы попробовать снова при следующем взаимодействии
            });
        };

        // Добавляем обработчики событий для различных пользовательских взаимодействий
        document.addEventListener('click', temporaryPlayHandler);
        document.addEventListener('touchstart', temporaryPlayHandler);
      }
    };

    // Устанавливаем флаг инициализации
    this.isInitialized = true;

    // Запускаем подготовку аудио
    prepareAudio();
  }
  
  /**
   * @deprecated Используйте автоматическую инициализацию
   */
  public userInteraction(): void {
    if (this.isServer) return;
    console.warn('userInteraction метод устарел и будет удален');
    // Для обратной совместимости оставляем метод пустым
  }

  /**
   * Загрузка звука для таймера
   */
  private loadTimerBeepSound() {
    // Не загружаем звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    try {
      // Создаем новый элемент аудио только в браузере
      if (typeof Audio !== 'undefined') {
        this.timerBeepSound = new Audio(this.soundPath);
        
        // Настраиваем аудио для лучшей совместимости
        this.timerBeepSound.preload = 'auto';
        
        // Добавляем обработчики событий
        this.timerBeepSound.addEventListener('ended', () => {
          // Удаляем элемент из активных, когда звук закончился
          this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== this.timerBeepSound);
        });
        
        // Подготавливаем аудио
        this.timerBeepSound.load();
      }
    } catch (error) {
      console.error('Failed to load timer beep sound:', error);
      this.timerBeepSound = null;
    }
  }

  /**
   * Воспроизведение звука таймера
   */
  playTimerBeep(isCompletion: boolean = false) {
    // Не воспроизводим звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Если звук отключен, воспроизводим только вибрацию (если возможно)
    if (this.isMuted) {
      if (isCompletion && this.canVibrate && typeof navigator !== 'undefined') {
        // Более длительная вибрация при завершении
        navigator.vibrate(1000);
      } else if (this.canVibrate && typeof navigator !== 'undefined') {
        navigator.vibrate(200);
      }
      return;
    }

    // Если это завершающий сигнал, запускаем режим сигнализации (непрерывное воспроизведение)
    if (isCompletion) {
      this.startAlarmMode();
      return;
    }

    // Для обычных звуков используем простое воспроизведение
    this.playSimpleBeep();
  }

  /**
   * Воспроизведение обычного однократного звукового сигнала
   */
  private playSimpleBeep() {
    // Не воспроизводим звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Проверяем, не воспроизводится ли уже непрерывный звук
    if (this.isPlayingContinuously) {
      return; // Пропускаем обычное воспроизведение, если уже идет непрерывное
    }

    // Добавляем воспроизведение в очередь
    this.addToPlaybackQueue(() => {
      // Ограничиваем количество одновременно воспроизводимых звуков
      if (this.activeAudioElements.length >= this.maxSimultaneousSounds) {
        // Убираем наиболее старые звуки, если превышен лимит
        const oldestAudio = this.activeAudioElements.shift();
        if (oldestAudio) {
          oldestAudio.pause();
          oldestAudio.currentTime = 0;
        }
      }

      try {
        // Создаем новый экземпляр звука для надежного воспроизведения
        if (typeof Audio !== 'undefined') {
          const newAudio = new Audio(this.soundPath);
          newAudio.volume = 1.0;
          
          // Добавляем обработчик завершения
          newAudio.onended = () => {
            this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== newAudio);
          };
          
          // Добавляем звук в список активных
          this.activeAudioElements.push(newAudio);
          
          // Воспроизводим звук
          newAudio.play().catch(err => {
            console.error('Error playing beep:', err);
            this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== newAudio);
          });
          
          // Вибрация для тактильной обратной связи (если доступно)
          if (this.canVibrate && typeof navigator !== 'undefined') {
            navigator.vibrate(200);
          }
        }
      } catch (error) {
        console.error('Failed to play simple beep:', error);
      }
    });
  }

  /**
   * Воспроизведение звука для режима будильника (окончание таймера)
   */
  private playAlarmBeep() {
    // Не воспроизводим звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Всегда останавливаем все предыдущие звуки перед новым воспроизведением
    this.stopAllSounds();

    // Небольшая задержка после остановки всех звуков, чтобы гарантировать их полное завершение
    setTimeout(() => {
      try {
        // Создаем новый экземпляр звука для каждого воспроизведения
        if (typeof Audio !== 'undefined') {
          const alarmAudio = new Audio(this.soundPath);
          alarmAudio.volume = 1.0; // Полная громкость для будильника
          
          // Добавляем обработчик завершения
          alarmAudio.onended = () => {
            this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== alarmAudio);
          };
          
          // Добавляем звук в список активных
          this.activeAudioElements.push(alarmAudio);
          
          // Воспроизводим звук
          alarmAudio.play().catch(err => {
            console.error('Error playing alarm beep:', err);
            this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== alarmAudio);
          });
          
          // Вибрация для тактильной обратной связи (если доступно)
          if (this.canVibrate && typeof navigator !== 'undefined') {
            navigator.vibrate(500); // Более длительная вибрация для будильника
          }
        }
      } catch (error) {
        console.error('Failed to play alarm beep:', error);
      }
    }, 100); // Небольшая задержка для гарантии остановки предыдущих звуков
  }

  /**
   * Запуск режима будильника (непрерывного воспроизведения)
   */
  private startAlarmMode() {
    // Не запускаем режим будильника на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Если режим уже запущен, ничего не делаем
    if (this.isPlayingContinuously) {
      return;
    }

    // Устанавливаем флаг непрерывного воспроизведения (для предотвращения перекрытия)
    this.isPlayingContinuously = true;
    
    // Воспроизводим только один звук при завершении таймера
    this.playAlarmBeep();
    
    // Автоматически сбрасываем флаг через 3 секунды, чтобы гарантировать
    // полное воспроизведение звука без наложений
    setTimeout(() => {
      this.isPlayingContinuously = false;
    }, 3000);
  }

  /**
   * Остановка всех звуков
   */
  private stopAllSounds() {
    // Не останавливаем звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Останавливаем все активные звуки
    this.activeAudioElements.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.error('Error stopping sound:', e);
      }
    });
    
    // Очищаем список активных звуков
    this.activeAudioElements = [];
  }

  /**
   * Добавление функции воспроизведения в очередь
   */
  private addToPlaybackQueue(playbackFn: () => void) {
    // Не добавляем в очередь на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Добавляем функцию в очередь
    this.soundPlaybackQueue.push(playbackFn);
    
    // Запускаем обработку очереди, если она еще не запущена
    if (!this.isProcessingQueue) {
      this.processPlaybackQueue();
    }
  }

  /**
   * Обработка очереди воспроизведения
   */
  private processPlaybackQueue() {
    // Не обрабатываем очередь на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    if (this.soundPlaybackQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    
    // Получаем и выполняем первую функцию из очереди
    const playbackFn = this.soundPlaybackQueue.shift();
    if (playbackFn) {
      playbackFn();
    }
    
    // Обрабатываем следующий элемент очереди с небольшой задержкой
    // для предотвращения перекрытия звуков
    setTimeout(() => {
      this.processPlaybackQueue();
    }, 100);
  }

  /**
   * Отключение звука
   */
  muteSound() {
    // Не отключаем звук на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    this.isMuted = true;
    this.stopAllSounds();
    this.saveSettings();
  }

  /**
   * Включение звука
   */
  unmuteSound() {
    // Не включаем звук на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    this.isMuted = false;
    this.saveSettings();
  }
  
  /**
   * Переключение звука (для обратной совместимости)
   * @returns текущее состояние (true - звук выключен, false - звук включен)
   */
  toggleMute(): boolean {
    // Не переключаем звук на сервере
    if (this.isServer || !this.isBrowserEnv()) return false;
    
    if (this.isMuted) {
      this.unmuteSound();
    } else {
      this.muteSound();
    }
    return this.isMuted;
  }

  /**
   * Сохранение настроек звука
   */
  private saveSettings() {
    // Не сохраняем настройки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('soundSettings', JSON.stringify({
          isMuted: this.isMuted
        }));
      }
    } catch (e) {
      console.error('Error saving sound settings:', e);
    }
  }

  /**
   * Проверка состояния звука (включен/выключен)
   */
  isSoundMuted() {
    // На сервере всегда возвращаем false
    if (this.isServer || !this.isBrowserEnv()) return false;
    
    return this.isMuted;
  }

  /**
   * Очистка ресурсов перед уничтожением
   */
  public dispose() {
    this.stopAllSounds();
    
    // Очищаем звуки
    this.timerBeepSound = null;
    this.activeAudioElements = [];
    this.soundPlaybackQueue = [];
    
    // Сбрасываем флаги
    this.isInitialized = false;
    this.isProcessingQueue = false;
    this.isPlayingContinuously = false;
  }

  /**
   * Уничтожение экземпляра Sound Manager
   */
  public destroy() {
    this.dispose();
    // Удаляем singleton инстанс
    (SoundManager as any)._instance = null;
  }
}

// Экспортируем экземпляр класса для использования во всем приложении
const soundManager = new SoundManager();
export default soundManager; 