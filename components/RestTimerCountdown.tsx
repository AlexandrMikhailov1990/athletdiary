import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RestTimerCountdownProps {
  seconds: number;
  isCountdownActive: boolean;
  onComplete?: () => void;
  hideText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RestTimerCountdown: React.FC<RestTimerCountdownProps> = ({ 
  seconds, 
  isCountdownActive, 
  onComplete, 
  hideText = false,
  size = 'md'
}) => {
  // Используем секунды как размер окружности
  const calculateSize = () => {
    switch(size) {
      case 'sm':
        return { circleSize: 60, fontSize: 'text-xl', strokeWidth: 4 };
      case 'md':
        return { circleSize: 100, fontSize: 'text-3xl', strokeWidth: 6 };
      case 'lg':
        return { circleSize: 150, fontSize: 'text-5xl', strokeWidth: 8 };
      default:
        return { circleSize: 100, fontSize: 'text-3xl', strokeWidth: 6 };
    }
  };

  const { circleSize, fontSize, strokeWidth } = calculateSize();
  const radius = circleSize / 2 - strokeWidth;
  const circumference = radius * 2 * Math.PI;
  
  const [progress, setProgress] = useState(circumference);
  const [vibrated, setVibrated] = useState(false);

  // Эффект для вибрации устройства при достижении определенного момента
  useEffect(() => {
    if (seconds === 3 && !vibrated && navigator.vibrate) {
      try {
        navigator.vibrate(200);
        setVibrated(true);
      } catch (error) {
        console.error('Вибрация не поддерживается или отключена', error);
      }
    }
    
    if (seconds > 3) {
      setVibrated(false);
    }
  }, [seconds, vibrated]);
  
  // Эффект для обновления прогресса анимации
  useEffect(() => {
    const maxSeconds = 5; // Максимальное значение для анимации
    const secondsToUse = Math.min(seconds, maxSeconds);
    const progressValue = circumference - (secondsToUse / maxSeconds) * circumference;
    setProgress(progressValue);
  }, [seconds, circumference]);
  
  // Эффект для вызова коллбэка по завершению
  useEffect(() => {
    if (seconds === 0 && onComplete) {
      onComplete();
    }
  }, [seconds, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        {/* Статичный фоновый круг */}
        <svg 
          className="absolute top-0 left-0" 
          width={circleSize} 
          height={circleSize}
        >
          <circle
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
          />
        </svg>
        
        {/* Анимированный прогресс */}
        <svg
          className="absolute top-0 left-0 -rotate-90 transform"
          width={circleSize}
          height={circleSize}
        >
          <motion.circle
            className={`${seconds <= 3 ? 'text-red-500' : 'text-blue-500'}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
          />
        </svg>
        
        {/* Текст обратного отсчета */}
        {!hideText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className={`${fontSize} font-bold ${seconds <= 3 ? 'text-red-600' : 'text-blue-600'}`}
              animate={{ 
                scale: isCountdownActive && seconds <= 3 ? [1, 1.2, 1] : 1,
              }}
              transition={{ 
                duration: 1, 
                ease: "easeInOut",
                repeat: isCountdownActive && seconds > 0 ? Infinity : 0
              }}
            >
              {seconds}
            </motion.span>
          </div>
        )}
      </div>
      
      {isCountdownActive && seconds <= 3 && !hideText && (
        <motion.p
          className="mt-2 text-red-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Приготовьтесь!
        </motion.p>
      )}
    </div>
  );
};

export default RestTimerCountdown; 