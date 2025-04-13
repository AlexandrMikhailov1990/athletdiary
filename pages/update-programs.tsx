import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { YOGA_BACK_PROGRAM, addYogaBackProgram } from '../models/YogaProgram';
import { ActiveProgram } from '../models/ActiveProgram';
import { Program } from '../models/Program';
import styles from '../styles/UpdatePrograms.module.css';

export default function UpdatePrograms() {
  const [messages, setMessages] = useState<string[]>([]);
  const [updatedPrograms, setUpdatedPrograms] = useState<boolean>(false);
  const router = useRouter();

  const updateAllPrograms = async () => {
    try {
      // Update Yoga Back Program (increase rest time)
      YOGA_BACK_PROGRAM.restBetweenExercises = 140;
      addYogaBackProgram();
      setMessages(prev => [...prev, "Йога для спины: увеличено время отдыха до 140 секунд"]);

      // Update active program if it's the yoga back program
      const activeProgram = localStorage.getItem('activeProgram');
      if (activeProgram) {
        const parsedActiveProgram = JSON.parse(activeProgram);
        if (parsedActiveProgram.programId === YOGA_BACK_PROGRAM.id) {
          parsedActiveProgram.program = YOGA_BACK_PROGRAM;
          localStorage.setItem('activeProgram', JSON.stringify(parsedActiveProgram));
          setMessages(prev => [...prev, "Обновлена активная программа"]);
        }
      }

      setUpdatedPrograms(true);
    } catch (error) {
      console.error('Error updating programs:', error);
      setMessages(prev => [...prev, `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Обновление программ</h1>
        
        <div className={styles.content}>
          <p>Эта страница позволяет обновить все программы, включая йогу и программы с гирями.</p>
          {messages.length > 0 && (
            <div className={styles.messageContainer}>
              <div className={styles.message}>
                {messages.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <button 
            className={styles.updateButton} 
            onClick={updateAllPrograms}
            disabled={updatedPrograms}
          >
            {updatedPrograms ? 'Программы обновлены' : 'Обновить программы'}
          </button>
          
          <button className={styles.backButton} onClick={() => router.push('/programs')}>
            Вернуться к списку программ
          </button>
        </div>

        <div className={styles.linkContainer}>
          <Link href="/programs" className={styles.link}>
            Перейти к программам
          </Link>
        </div>
      </div>
    </div>
  );
} 