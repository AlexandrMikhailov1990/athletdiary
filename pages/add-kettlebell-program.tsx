import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { addKettlebellProgramToUserPrograms } from '../models/KettlebellProgram';
import styles from '../styles/KettlebellProgram.module.css';

const AddKettlebellProgram: NextPage = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddProgram = () => {
    setIsLoading(true);
    
    try {
      // Используем готовую функцию из KettlebellProgram модуля
      addKettlebellProgramToUserPrograms();
      setIsCreated(true);
    } catch (error) {
      console.error('Ошибка при сохранении программы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrograms = () => {
    router.push('/programs');
  };

  return (
    <>
      <Head>
        <title>Добавить гиревую программу | АтлетДиари</title>
        <meta name="description" content="Создайте программу тренировок с гирями" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Гиревой тренинг</h1>
        <div className={styles.content}>
          <p className={styles.description}>
            Гиревые тренировки — это эффективный способ развития силы, выносливости и функциональности.
            Данная программа включает тренировку с гирей и подтягиваниями для ежедневных занятий.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>Преимущества тренировок с гирями:</h3>
              <ul>
                <li>Развитие функциональной силы</li>
                <li>Улучшение сердечно-сосудистой выносливости</li>
                <li>Развитие координации и баланса</li>
                <li>Тренировка всего тела с минимальным оборудованием</li>
                <li>Сжигание калорий и улучшение метаболизма</li>
              </ul>
            </div>
            <div className={styles.feature}>
              <h3>Упражнения в программе:</h3>
              <ul>
                <li>Подтягивания прямым хватом - 3 подхода по 5 повторений</li>
                <li>Круговые движения гирей - 2 подхода по 30 секунд</li>
                <li>Махи гирей (свинг) - 3 подхода по 10 повторений</li>
                <li>Приседания с гирей - 3 подхода по 10 повторений</li>
              </ul>
            </div>
          </div>
          
          {!isCreated ? (
            <button 
              className={styles.addButton}
              onClick={handleAddProgram}
              disabled={isLoading}
            >
              {isLoading ? 'Добавление...' : 'Добавить программу'}
            </button>
          ) : (
            <div className={styles.successMessage}>
              <p>Программа успешно добавлена!</p>
              <p>Вы можете найти ее в разделе "Программы".</p>
              <button 
                className={styles.addButton}
                onClick={goToPrograms}
                style={{ marginTop: '1rem', backgroundColor: '#38a169' }}
              >
                Перейти к программам
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddKettlebellProgram; 