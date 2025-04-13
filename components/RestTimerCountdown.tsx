import React from 'react';
import styles from '../styles/RestTimer.module.css';

interface RestTimerCountdownProps {
  seconds: number;
  isCountdownActive: boolean;
}

const RestTimerCountdown: React.FC<RestTimerCountdownProps> = ({ seconds, isCountdownActive }) => {
  const isFinalSeconds = seconds <= 3;
  
  return (
    <div className={styles.countdownContainer}>
      <div 
        className={`${styles.countdownNumber} ${isCountdownActive ? styles.countdownActive : ''} ${isFinalSeconds ? styles.countdownFinal : ''}`}
      >
        {seconds}
      </div>
    </div>
  );
};

export default RestTimerCountdown; 