import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import soundManager from '../utils/SoundManager';
import { motion } from 'framer-motion';
import RestTimerCountdown from '../components/RestTimerCountdown';

interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  timerCountdown: boolean;
  darkMode: boolean;
  restTimerDefault: number;
  dataAutosave: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    vibrationEnabled: true,
    timerCountdown: true,
    darkMode: false,
    restTimerDefault: 60,
    dataAutosave: true
  });
  
  const [testCountdown, setTestCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Загружаем настройки при монтировании компонента
  useEffect(() => {
    // Загрузка настроек из localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
      }
    }
    
    // Проверяем текущую настройку звука
    setSettings(prev => ({
      ...prev,
      soundEnabled: !soundManager.isSoundMuted()
    }));
  }, []);

  // Сохранение настроек
  const saveSettings = () => {
    setIsSaving(true);
    
    // Применяем настройки звука
    if (settings.soundEnabled) {
      soundManager.unmuteSound();
    } else {
      soundManager.muteSound();
    }
    
    // Сохраняем в localStorage
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Анимация сохранения
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        
        // Скрываем сообщение об успехе через 2 секунды
        setTimeout(() => {
          setSaveSuccess(false);
        }, 2000);
      }, 700);
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      setIsSaving(false);
    }
  };

  // Функция для сброса настроек
  const resetSettings = () => {
    const defaultSettings: Settings = {
      soundEnabled: true,
      vibrationEnabled: true,
      timerCountdown: true,
      darkMode: false,
      restTimerDefault: 60,
      dataAutosave: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    
    // Применяем настройки звука
    soundManager.unmuteSound();
    
    // Показываем сообщение об успехе
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  // Функция для тестирования звука
  const testSound = () => {
    soundManager.playTimerBeep(true);
  };

  // Функция для тестирования вибрации
  const testVibration = () => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      try {
        navigator.vibrate(200);
      } catch (error) {
        console.error('Вибрация не поддерживается или отключена', error);
      }
    }
  };

  // Функция для тестирования таймера обратного отсчета
  const testCountdownTimer = () => {
    setTestCountdown(5);
    setShowCountdown(true);
    
    const interval = setInterval(() => {
      setTestCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => setShowCountdown(false), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Настройки</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Секция звука */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Звук и вибрация</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="sound-toggle" className="block text-gray-700 font-medium mb-1">Звук приложения</label>
                  <p className="text-sm text-gray-500">Включить звуковые эффекты</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="sound-toggle"
                    className="sr-only"
                    checked={settings.soundEnabled}
                    onChange={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  >
                    <div 
                      className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${settings.soundEnabled ? 'translate-x-6' : ''}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="vibration-toggle" className="block text-gray-700 font-medium mb-1">Вибрация</label>
                  <p className="text-sm text-gray-500">Включить тактильную обратную связь</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="vibration-toggle"
                    className="sr-only"
                    checked={settings.vibrationEnabled}
                    onChange={() => setSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }))}
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${settings.vibrationEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }))}
                  >
                    <div 
                      className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${settings.vibrationEnabled ? 'translate-x-6' : ''}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={testSound}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  disabled={!settings.soundEnabled}
                >
                  Проверить звук
                </button>
                <button
                  onClick={testVibration}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  disabled={!settings.vibrationEnabled}
                >
                  Проверить вибрацию
                </button>
              </div>
            </div>
          </div>
          
          {/* Секция таймера */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Настройки таймера</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="countdown-toggle" className="block text-gray-700 font-medium mb-1">Обратный отсчет</label>
                  <p className="text-sm text-gray-500">Показывать 5-секундный отсчет</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="countdown-toggle"
                    className="sr-only"
                    checked={settings.timerCountdown}
                    onChange={() => setSettings(prev => ({ ...prev, timerCountdown: !prev.timerCountdown }))}
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${settings.timerCountdown ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setSettings(prev => ({ ...prev, timerCountdown: !prev.timerCountdown }))}
                  >
                    <div 
                      className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${settings.timerCountdown ? 'translate-x-6' : ''}`}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="rest-timer" className="block text-gray-700 font-medium mb-1">Время отдыха по умолчанию</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="rest-timer"
                    min="30"
                    max="180"
                    step="15"
                    value={settings.restTimerDefault}
                    onChange={(e) => setSettings(prev => ({ ...prev, restTimerDefault: parseInt(e.target.value) }))}
                    className="w-full mr-4"
                  />
                  <span className="text-gray-700 font-medium min-w-[4rem]">{settings.restTimerDefault} сек</span>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={testCountdownTimer}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  disabled={!settings.timerCountdown}
                >
                  Проверить таймер
                </button>
                
                {showCountdown && (
                  <div className="mt-4 flex justify-center">
                    <RestTimerCountdown seconds={testCountdown} isCountdownActive={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Секция внешнего вида */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Внешний вид</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="dark-mode-toggle" className="block text-gray-700 font-medium mb-1">Темная тема</label>
                  <p className="text-sm text-gray-500">В разработке</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="dark-mode-toggle"
                    className="sr-only"
                    checked={settings.darkMode}
                    onChange={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                    disabled={true}
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors bg-gray-300 opacity-50`}
                  >
                    <div 
                      className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform transform`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Секция данных */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Данные и безопасность</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="autosave-toggle" className="block text-gray-700 font-medium mb-1">Автосохранение</label>
                  <p className="text-sm text-gray-500">Сохранять прогресс тренировки автоматически</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="autosave-toggle"
                    className="sr-only"
                    checked={settings.dataAutosave}
                    onChange={() => setSettings(prev => ({ ...prev, dataAutosave: !prev.dataAutosave }))}
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${settings.dataAutosave ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setSettings(prev => ({ ...prev, dataAutosave: !prev.dataAutosave }))}
                  >
                    <div 
                      className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${settings.dataAutosave ? 'translate-x-6' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Кнопки внизу */}
          <div className="pt-6 flex flex-col space-y-3">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className={`${
                isSaving 
                  ? 'bg-blue-400' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </>
              ) : (
                'Сохранить настройки'
              )}
            </button>
            
            <button
              onClick={resetSettings}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Сбросить настройки
            </button>
          </div>
          
          {/* Сообщение об успешном сохранении */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mt-4"
            >
              Настройки успешно сохранены!
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
} 