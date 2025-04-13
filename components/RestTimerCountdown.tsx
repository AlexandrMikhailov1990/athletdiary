import React from 'react';

interface RestTimerCountdownProps {
  seconds: number;
  isCountdownActive: boolean;
}

const RestTimerCountdown: React.FC<RestTimerCountdownProps> = ({ seconds, isCountdownActive }) => {
  return (
    <div className={`
      flex flex-col items-center justify-center 
      ${isCountdownActive ? 'animate-pulse' : ''}
    `}>
      <div className="relative w-36 h-36 bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <div className="absolute w-32 h-32 bg-gray-700 rounded-full"></div>
        <div className="z-10 text-5xl font-bold text-white tracking-wider">
          {seconds}
        </div>
        <svg className="absolute inset-0" width="144" height="144" viewBox="0 0 144 144">
          <circle 
            className="text-gray-700" 
            strokeWidth="8" 
            stroke="currentColor" 
            fill="transparent" 
            r="64" 
            cx="72" 
            cy="72" 
          />
          <circle 
            className="text-red-500 transition-all duration-300 ease-linear" 
            strokeWidth="8" 
            strokeDasharray={Math.PI * 2 * 64}
            strokeDashoffset={Math.PI * 2 * 64 * (1 - seconds / 5)} 
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
            r="64" 
            cx="72" 
            cy="72" 
            transform="rotate(-90 72 72)" 
          />
        </svg>
      </div>
      <p className={`text-xl font-semibold ${seconds <= 2 ? 'text-red-500' : 'text-white'}`}>
        {seconds <= 2 ? 'Почти готово!' : 'Отдых...'}
      </p>
    </div>
  );
};

export default RestTimerCountdown; 