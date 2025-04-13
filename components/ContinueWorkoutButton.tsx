import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { hasActiveWorkout } from '../models/WorkoutProgress';

interface ContinueWorkoutButtonProps {
  className?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
  compact?: boolean;
}

const ContinueWorkoutButton: React.FC<ContinueWorkoutButtonProps> = ({ 
  className = '', 
  fullWidth = false,
  iconOnly = false,
  compact = false
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Проверяем наличие активной тренировки только на клиенте
    setIsVisible(hasActiveWorkout());
  }, []);

  // Если нет активной тренировки, не отображаем кнопку
  if (!isVisible) return null;

  const handleContinueWorkout = () => {
    router.push('/workout');
  };

  // Базовые классы для кнопки
  let buttonClasses = 'flex items-center justify-center text-white transition-colors duration-200 rounded-lg shadow-md relative';
  
  // Стили для разных вариаций кнопки
  if (iconOnly) {
    buttonClasses += ' bg-green-600 hover:bg-green-700 p-1';
  } else if (compact) {
    buttonClasses += ' bg-green-600 hover:bg-green-700 text-sm px-2 py-1';
  } else {
    buttonClasses += ' bg-green-600 hover:bg-green-700';
  }

  // Добавляем классы для разных размеров
  if (fullWidth) {
    buttonClasses += ' w-full px-4 py-2';
  } else if (!iconOnly && !compact) {
    buttonClasses += ' px-4 py-2';
  }
  
  // Добавляем пользовательские классы
  buttonClasses += ` ${className}`;

  return (
    <div className="relative">
      <button
        onClick={handleContinueWorkout}
        className={buttonClasses}
        onMouseEnter={() => iconOnly && setShowTooltip(true)}
        onMouseLeave={() => iconOnly && setShowTooltip(false)}
        aria-label="Продолжить тренировку"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${iconOnly ? 'h-5 w-5' : 'h-5 w-5 mr-2'}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        {!iconOnly && <span>Продолжить тренировку</span>}
      </button>
      
      {/* Тултип для иконочного режима */}
      {iconOnly && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap z-10">
          Продолжить тренировку
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default ContinueWorkoutButton; 