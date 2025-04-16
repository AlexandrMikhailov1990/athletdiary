import { useEffect, useRef } from 'react';
import soundManager from '../utils/SoundManager';

interface AudioPlayerProps {
  soundPath: string;
  autoPlay?: boolean;
  volume?: number;
  loop?: boolean;
  isCompletion?: boolean;
}

/**
 * Компонент для воспроизведения звуков с расширенной диагностикой
 */
const AudioPlayer = ({ 
  soundPath, 
  autoPlay = false, 
  volume = 1.0, 
  loop = false,
  isCompletion = false
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedRef = useRef<boolean>(false); // Для отслеживания был ли уже воспроизведен звук
  
  // Используем только один метод воспроизведения - через SoundManager
  useEffect(() => {
    // Этот эффект должен выполниться только один раз при монтировании
    if (typeof window === 'undefined' || playedRef.current) return;
    
    // Помечаем как воспроизведенный сразу, чтобы избежать повторных вызовов
    playedRef.current = true;
    
    try {
      console.log(`[AudioPlayer] Воспроизведение звука ${isCompletion ? 'завершения' : 'обратного отсчета'}`);
      
      // Используем небольшую задержку для предотвращения конфликтов
      setTimeout(() => {
        if (autoPlay) {
          soundManager.playTimerBeep(0, isCompletion);
        }
      }, 50);
    } catch (error) {
      console.error('[AudioPlayer] Ошибка при воспроизведении звука:', error);
    }
  }, []); // Пустой массив зависимостей гарантирует однократное выполнение
  
  // Компонент не рендерит видимый UI
  return null;
};

export default AudioPlayer; 