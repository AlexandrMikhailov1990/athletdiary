/**
 * Менеджер звуков для приложения
 */
class SoundManager {
  private isInitialized = false;
  private isMuted = false;
  private canVibrate = false;
  private audioContext: AudioContext | null = null;
  private countdownBuffer: AudioBuffer | null = null; // Звук для отсчета
  private completionBuffer: AudioBuffer | null = null; // Звук для завершения
  private isServer: boolean;
  private isIOS: boolean;
  private hasUserInteraction = false;

  constructor() {
    // Проверяем, запущен ли код на сервере или в браузере
    this.isServer = typeof window === 'undefined';
    this.isIOS = this.detectIOSDevice();
    
    // Инициализируем менеджер звуков только на клиенте
    if (!this.isServer) {
      this.initialize();
      this.setupUserInteractionHandlers();
      console.log('SoundManager initialized, iOS device detected:', this.isIOS);
    }
  }

  /**
   * Более точное определение iOS устройств
   */
  private detectIOSDevice(): boolean {
    if (this.isServer || typeof navigator === 'undefined') return false;
    
    // Проверяем по user agent
    const ua = navigator.userAgent;
    const isIPad = /iPad/i.test(ua);
    const isIPhone = /iPhone/i.test(ua);
    const isIPod = /iPod/i.test(ua);
    
    // Дополнительная проверка для iPad в режиме планшета в Safari
    const isIPadOS = navigator.platform === 'MacIntel' && 
                    navigator.maxTouchPoints > 1 &&
                    !((window as any).MSStream);
    
    return isIPad || isIPhone || isIPod || isIPadOS;
  }

  private setupUserInteractionHandlers() {
    if (this.isServer) return;

    const handleInteraction = () => {
      this.hasUserInteraction = true;
      
      // Инициализируем AudioContext при первом взаимодействии
      if (!this.audioContext && window.AudioContext) {
        this.initAudioContext();
      }
      
      // Для iOS устройств пытаемся активировать звук
      if (this.isIOS) {
        this.requestIOSAudioPermission();
      }
    };

    // Добавляем обработчики для различных типов взаимодействия
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
  }

  /**
   * Запрос разрешения на воспроизведение звука в iOS
   * Решает проблемы с автозапуском аудио в Safari
   */
  private async requestIOSAudioPermission() {
    if (!this.isIOS || !this.audioContext) return;
    
    try {
      console.log('Requesting iOS audio permission');
      
      // Пытаемся возобновить AudioContext
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('AudioContext resumed on iOS:', this.audioContext.state);
      }
      
      // Создаем короткий тихий звук для "разблокировки" WebAudio
      const silentBuffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
      source.stop(0.001); // Останавливаем почти сразу
      
      console.log('iOS audio permission requested successfully');
    } catch (error) {
      console.error('Error requesting iOS audio permission:', error);
    }
  }

  /**
   * Инициализация Web Audio API
   */
  private initAudioContext() {
    if (this.isServer || typeof window === 'undefined') return;
    
    try {
      // Проверяем, доступен ли AudioContext в браузере
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.log('AudioContext не поддерживается в этом браузере');
        return;
      }
      
      // Создаем AudioContext без особых параметров для максимальной совместимости
      this.audioContext = new AudioContextClass();
      
      // Создаем синтетические звуковые сигналы
      this.createCountdownBeep(); // Звук для отсчета последних секунд
      this.createCompletionBeep(); // Звук для завершения таймера
      
      console.log('AudioContext initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      this.audioContext = null;
    }
  }
  
  /**
   * Создание синтетического звукового сигнала для отсчета секунд
   */
  private createCountdownBeep() {
    if (!this.audioContext) return;
    
    try {
      // Создаем буфер для короткого звукового сигнала
      const sampleRate = this.audioContext.sampleRate;
      const duration = 0.08; // 80 мс - очень короткий сигнал
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Заполняем буфер синусоидальным сигналом частотой 1200 Гц
      const frequency = 1200;
      for (let i = 0; i < bufferSize; i++) {
        // Создаем синусоидальный сигнал с плавным нарастанием и затуханием
        const progress = i / bufferSize;
        // Амплитудная огибающая с плавным нарастанием и затуханием
        let amplitude;
        if (progress < 0.1) {
          // Нарастание в первые 10% времени
          amplitude = progress / 0.1;
        } else if (progress > 0.9) {
          // Затухание в последние 10% времени
          amplitude = (1 - progress) / 0.1;
        } else {
          // Полная громкость в середине
          amplitude = 1.0;
        }
        data[i] = 0.5 * amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
      }
      
      this.countdownBuffer = buffer;
      console.log('Created countdown beep sound');
    } catch (error) {
      console.error('Error creating countdown beep:', error);
    }
  }

  /**
   * Создание синтетического звукового сигнала для завершения таймера
   */
  private createCompletionBeep() {
    if (!this.audioContext) return;
    
    try {
      // Создаем буфер для сигнала окончания (чуть длиннее)
      const sampleRate = this.audioContext.sampleRate;
      const duration = 0.2; // 200 мс - длиннее, чем отсчет
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Используем другую, более низкую частоту для явного различия
      const frequency = 800; // Используем более низкую частоту для отличия
      for (let i = 0; i < bufferSize; i++) {
        const progress = i / bufferSize;
        let amplitude;
        if (progress < 0.1) {
          amplitude = progress / 0.1;
        } else if (progress > 0.9) {
          amplitude = (1 - progress) / 0.1;
        } else {
          amplitude = 1.0;
        }
        data[i] = 0.5 * amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
      }
      
      this.completionBuffer = buffer;
      console.log('Created completion beep sound');
    } catch (error) {
      console.error('Error creating completion beep:', error);
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
   */
  public initialize() {
    // Не инициализируем на сервере
    if (this.isServer || !this.isBrowserEnv()) return;
    
    // Не инициализируем повторно
    if (this.isInitialized) return;

    // Проверяем поддержку вибрации
    this.canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

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

    // Устанавливаем флаг инициализации
    this.isInitialized = true;
    
    console.log('SoundManager initialization complete');
  }

  /**
   * Воспроизведение звука для отсчета последних секунд
   */
  private async playCountdownSound() {
    if (this.isServer || this.isMuted || !this.audioContext || !this.countdownBuffer) return;
    
    try {
      // Проверяем состояние AudioContext
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Создаем источник звука
      const source = this.audioContext.createBufferSource();
      source.buffer = this.countdownBuffer;
      
      // Добавляем регулятор громкости
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.5; // Увеличенная громкость с 0.3 до 0.5 (50%)
      
      // Подключаем источник к регулятору громкости, а затем к выходу
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Воспроизводим звуковой сигнал
      source.start(0);
      console.log('Playing countdown beep');
    } catch (error) {
      console.error('Error playing countdown sound:', error);
    }
  }

  /**
   * Воспроизведение звука завершения таймера
   */
  private async playCompletionSound() {
    if (this.isServer || this.isMuted || !this.audioContext || !this.completionBuffer) return;
    
    try {
      // Проверяем состояние AudioContext
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Создаем источник звука
      const source = this.audioContext.createBufferSource();
      source.buffer = this.completionBuffer;
      
      // Добавляем регулятор громкости
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.6; // Увеличенная громкость с 0.4 до 0.6 (60%, чуть громче, чем отсчет)
      
      // Подключаем источник к регулятору громкости, а затем к выходу
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Воспроизводим звуковой сигнал
      source.start(0);
      console.log('Playing completion beep');
    } catch (error) {
      console.error('Error playing completion sound:', error);
    }
  }

  /**
   * Публичный метод для воспроизведения звука таймера
   * @param secondsLeft - Количество секунд, оставшихся до конца таймера
   * @param isCompletion - Флаг, указывающий, что таймер завершился
   */
  public async playTimerBeep(secondsLeft: number = 0, isCompletion: boolean = false) {
    // Не воспроизводим звук, если это серверный рендеринг или звук отключен
    if (this.isServer || this.isMuted) {
      console.log('Sound skipped: server rendering or muted');
      return;
    }
    
    console.log(`Timer beep: ${secondsLeft}s left, completion: ${isCompletion}, iOS: ${this.isIOS}, userInteraction: ${this.hasUserInteraction}`);
    
    // Для iOS требуется пользовательское взаимодействие
    if (this.isIOS && !this.hasUserInteraction) {
      console.warn('Sound not played: waiting for user interaction on iOS');
      
      // Пытаемся запросить разрешение, если это действие инициировано пользователем
      this.requestIOSAudioPermission();
      return;
    }
    
    // Вибрация в зависимости от ситуации
    if (this.canVibrate && navigator.vibrate) {
      if (isCompletion) {
        // Длинная вибрация для завершения
        navigator.vibrate(300);
        console.log('Vibrating for completion: 300ms');
      } else if (secondsLeft <= 5 && secondsLeft > 0) {
        // Короткая вибрация для отсчета последних 5 секунд
        navigator.vibrate(100);
        console.log(`Vibrating for countdown (${secondsLeft}s): 100ms`);
      }
    }
    
    try {
      // Создаем/инициализируем AudioContext при необходимости
      if (!this.audioContext && window.AudioContext) {
        console.log('Initializing AudioContext');
        this.initAudioContext();
      }
      
      if (this.isIOS) {
        // Для iOS перезагружаем контекст перед каждым воспроизведением
        if (this.audioContext && this.audioContext.state === 'suspended') {
          console.log('Resuming suspended AudioContext on iOS');
          try {
            await this.audioContext.resume();
            console.log('AudioContext state after resume:', this.audioContext.state);
          } catch (error) {
            console.error('Failed to resume AudioContext:', error);
          }
        }
      }
      
      if (isCompletion) {
        // Воспроизводим звук завершения (низкий тон)
        console.log('Playing completion sound');
        await this.playCompletionSound();
      } else if (secondsLeft <= 5 && secondsLeft > 0) {
        // Воспроизводим звук отсчета (короткий высокий тон) для последних 5 секунд
        console.log(`Playing countdown sound for ${secondsLeft}s`);
        await this.playCountdownSound();
      }
    } catch (error) {
      console.error('Error in playTimerBeep:', error);
    }
  }

  /**
   * Отключение звука
   */
  muteSound() {
    this.isMuted = true;
    this.saveSettings();
  }

  /**
   * Включение звука
   */
  unmuteSound() {
    this.isMuted = false;
    this.saveSettings();
  }
  
  /**
   * Переключение звука
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    return this.isMuted;
  }

  /**
   * Сохранение настроек звука
   */
  private saveSettings() {
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
    return this.isMuted;
  }

  /**
   * Очистка ресурсов перед уничтожением
   */
  public dispose() {
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {
        console.error('Error closing AudioContext:', e);
      }
    }
    
    this.audioContext = null;
    this.countdownBuffer = null;
    this.completionBuffer = null;
    this.isInitialized = false;
  }
}

// Экспортируем экземпляр класса для использования во всем приложении
const soundManager = new SoundManager();
export default soundManager; 