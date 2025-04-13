import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { hasActiveWorkout } from '../models/WorkoutProgress';

interface ContinueWorkoutButtonProps {
  className?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

const ContinueWorkoutButton: React.FC<ContinueWorkoutButtonProps> = ({ 
  className = '', 
  fullWidth = false,
  iconOnly = false 
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

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
  let buttonClasses = 'flex items-center justify-center bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 rounded-lg shadow-md';
  
  // Добавляем классы для разных размеров
  if (fullWidth) {
    buttonClasses += ' w-full';
  } else {
    buttonClasses += ' px-4 py-2';
  }
  
  // Добавляем пользовательские классы
  buttonClasses += ` ${className}`;

  return (
    <button
      onClick={handleContinueWorkout}
      className={buttonClasses}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
      {!iconOnly && <span>Продолжить тренировку</span>}
    </button>
  );
};

export default ContinueWorkoutButton; 