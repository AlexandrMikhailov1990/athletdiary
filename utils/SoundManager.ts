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
  private alternativeSoundPaths: string[] = [
    '/timer-beep.mp3',      // Корневая директория
    '/static/timer-beep.mp3', // Альтернативный путь
    '/static/sounds/timer-beep.mp3' // Еще один путь
  ];
  private isServer: boolean;
  private isPlayingNow = false; // Флаг текущего воспроизведения
  private lastPlayTime = 0; // Время последнего воспроизведения

  constructor() {
    // Проверяем, запущен ли код на сервере или в браузере
    this.isServer = typeof window === 'undefined';
    
    // Инициализируем менеджер звуков только на клиенте
    if (!this.isServer) {
      this.initialize();
      console.log('SoundManager initialized. Sound path:', this.soundPath);
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
        // Проверяем доступность звукового файла
        console.log('Attempting to load sound from:', this.soundPath);
        
        this.timerBeepSound = new Audio(this.soundPath);
        
        // Обработчик для проверки ошибки загрузки и попытки использовать альтернативные пути
        this.timerBeepSound.onerror = () => {
          console.error(`Не удалось загрузить звук по пути: ${this.soundPath}, пробую альтернативные пути`);
          this.tryAlternativeSoundPaths();
        };
        
        // Настраиваем аудио для лучшей совместимости
        this.timerBeepSound.preload = 'auto';
        
        // Добавляем обработчики событий
        this.timerBeepSound.addEventListener('canplaythrough', () => {
          console.log('Sound loaded successfully and can play through');
        });
        
        this.timerBeepSound.addEventListener('error', (e) => {
          console.error('Error loading sound:', e);
        });
        
        this.timerBeepSound.addEventListener('ended', () => {
          // Удаляем элемент из активных, когда звук закончился
          this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== this.timerBeepSound);
          console.log('Sound playback ended');
        });
        
        // Подготавливаем аудио
        this.timerBeepSound.load();
      }
    } catch (error) {
      console.error('Failed to load timer beep sound:', error);
      this.timerBeepSound = null;
      // Пробуем альтернативные пути
      this.tryAlternativeSoundPaths();
    }
  }
  
  /**
   * Пробует загрузить звук из альтернативных источников
   */
  private tryAlternativeSoundPaths() {
    if (this.isServer || !this.isBrowserEnv()) return;
    
    for (const path of this.alternativeSoundPaths) {
      try {
        console.log(`Attempting to load sound from alternative path: ${path}`);
        const audio = new Audio(path);
        
        // Настраиваем обработчик успешной загрузки
        audio.oncanplaythrough = () => {
          console.log(`Sound successfully loaded from alternative path: ${path}`);
          this.timerBeepSound = audio;
          this.soundPath = path; // Обновляем основной путь на рабочий
        };
        
        // Обработчик ошибки для продолжения перебора
        audio.onerror = () => {
          console.error(`Failed to load sound from alternative path: ${path}`);
        };
        
        // Пытаемся загрузить
        audio.load();
      } catch (error) {
        console.error(`Error trying alternative sound path ${path}:`, error);
      }
    }
  }

  /**
   * Воспроизведение звука таймера
   */
  playTimerBeep(isCompletion: boolean = false) {
    // Не воспроизводим звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Проверяем, не воспроизводится ли уже звук
    const currentTime = Date.now();
    if (this.isPlayingNow && currentTime - this.lastPlayTime < 1000) {
      console.log(`Skip playing timer beep. Already playing: ${this.isPlayingNow}, last play: ${currentTime - this.lastPlayTime}ms ago`);
      return;
    }
    
    // Устанавливаем флаг воспроизведения и обновляем время последнего воспроизведения
    this.isPlayingNow = true;
    this.lastPlayTime = currentTime;
    
    console.log(`Playing timer beep. isCompletion: ${isCompletion}, isMuted: ${this.isMuted}`);
    
    // Принудительное воспроизведение через прямой вызов Audio API
    // Это более надежный способ для мобильных устройств
    try {
      // Небольшая задержка перед воспроизведением для стабильности
      setTimeout(() => {
        const directAudio = new Audio(this.soundPath);
        directAudio.volume = 1.0;
        directAudio.play().catch(e => console.error('Ошибка прямого воспроизведения:', e));
      }, 50);
    } catch (e) {
      console.error('Ошибка создания прямого аудио:', e);
    }
    
    // Сбрасываем флаг воспроизведения через некоторое время
    setTimeout(() => {
      this.isPlayingNow = false;
    }, 1000);
    
    // Если звук отключен, воспроизводим только вибрацию (если возможно)
    if (this.isMuted) {
      if (isCompletion && this.canVibrate && typeof navigator !== 'undefined') {
        // Более длительная вибрация при завершении
        navigator.vibrate(1000);
        console.log('Playing vibration pattern for completion');
      } else if (this.canVibrate && typeof navigator !== 'undefined') {
        navigator.vibrate(200);
        console.log('Playing short vibration');
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
    
    // Проверяем, не воспроизводится ли уже звук
    const currentTime = Date.now();
    if (this.isPlayingNow && currentTime - this.lastPlayTime < 1000) {
      console.log('Skipping simple beep because sound was played recently');
      return;
    }
    
    // Устанавливаем флаг воспроизведения и обновляем время
    this.isPlayingNow = true;
    this.lastPlayTime = currentTime;
    
    console.log('Playing simple beep, isPlayingContinuously:', this.isPlayingContinuously);
    
    // Проверяем, не воспроизводится ли уже непрерывный звук
    if (this.isPlayingContinuously) {
      console.log('Skipping simple beep because continuous sound is playing');
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
          console.log('Stopped oldest audio to make room for new sound');
        }
      }

      try {
        // Создаем новый экземпляр звука для надежного воспроизведения
        if (typeof Audio !== 'undefined') {
          console.log('Creating new Audio instance for simple beep');
          const newAudio = new Audio(this.soundPath);
          newAudio.volume = 1.0;
          
          // Добавляем обработчик ошибок
          newAudio.onerror = (e) => {
            console.error('Error with simple beep playback:', e);
          };
          
          // Добавляем обработчик завершения
          newAudio.onended = () => {
            this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== newAudio);
            console.log('Simple beep playback ended');
            this.isPlayingNow = false; // Сбрасываем флаг по завершении
          };
          
          // Добавляем звук в список активных
          this.activeAudioElements.push(newAudio);
          
          // Воспроизводим звук
          const playPromise = newAudio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Simple beep playback started successfully');
              })
              .catch(err => {
                console.error('Error playing simple beep:', err);
                this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== newAudio);
                this.isPlayingNow = false; // Сбрасываем флаг при ошибке
              });
          }
          
          // Вибрация для тактильной обратной связи (если доступно)
          if (this.canVibrate && typeof navigator !== 'undefined') {
            navigator.vibrate(200);
            console.log('Vibration triggered for simple beep');
          }
        }
      } catch (error) {
        console.error('Failed to play simple beep:', error);
        this.isPlayingNow = false; // Сбрасываем флаг при ошибке
      }
    });
  }

  /**
   * Воспроизведение звука для режима будильника (окончание таймера)
   */
  private playAlarmBeep() {
    // Не воспроизводим звуки на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    console.log('Starting alarm beep playback');
    
    // Всегда останавливаем все предыдущие звуки перед новым воспроизведением
    this.stopAllSounds();

    // Небольшая задержка после остановки всех звуков, чтобы гарантировать их полное завершение
    setTimeout(() => {
      try {
        // Создаем новый экземпляр звука для каждого воспроизведения
        if (typeof Audio !== 'undefined') {
          console.log('Creating new Audio instance for alarm beep');
          const alarmAudio = new Audio(this.soundPath);
          alarmAudio.volume = 1.0; // Полная громкость для будильника
          
          // Добавляем обработчик ошибок
          alarmAudio.onerror = (e) => {
            console.error('Error with alarm beep playback:', e);
          };
          
          // Добавляем обработчик завершения
          alarmAudio.onended = () => {
            this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== alarmAudio);
            console.log('Alarm beep playback ended');
          };
          
          // Добавляем звук в список активных
          this.activeAudioElements.push(alarmAudio);
          
          // Воспроизводим звук
          const playPromise = alarmAudio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Alarm beep playback started successfully');
              })
              .catch(err => {
                console.error('Error playing alarm beep:', err);
                this.activeAudioElements = this.activeAudioElements.filter(audio => audio !== alarmAudio);
              });
          }
          
          // Вибрация для тактильной обратной связи (если доступно)
          if (this.canVibrate && typeof navigator !== 'undefined') {
            navigator.vibrate(500); // Более длительная вибрация для будильника
            console.log('Vibration triggered for alarm beep');
          }
        }
      } catch (error) {
        console.error('Failed to play alarm beep:', error);
      }
    }, 200); // Увеличенная задержка для гарантии остановки предыдущих звуков
  }

  /**
   * Запуск режима будильника (непрерывного воспроизведения)
   */
  private startAlarmMode() {
    // Не запускаем режим будильника на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Проверяем, не воспроизводится ли уже звук
    const currentTime = Date.now();
    if (this.isPlayingNow && currentTime - this.lastPlayTime < 1000) {
      console.log('Skipping alarm mode because sound was played recently');
      return;
    }
    
    // Устанавливаем флаг воспроизведения и обновляем время
    this.isPlayingNow = true;
    this.lastPlayTime = currentTime;
    
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
      this.isPlayingNow = false; // Также сбрасываем флаг воспроизведения
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