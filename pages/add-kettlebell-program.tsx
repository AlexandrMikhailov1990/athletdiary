import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import { Program } from '../models/Program';
import { Exercise } from '../models/Exercise';
import soundManager from '../utils/SoundManager';
import styles from '../styles/KettlebellProgram.module.css';

const AddKettlebellProgram: NextPage = () => {
  const [isCreated, setIsCreated] = useState(false);
  
  useEffect(() => {
    return () => {
      soundManager.stopAll();
    };
  }, []);

  const createKettlebellProgram = () => {
    // Создаем упражнения для гиревой программы
    const kettlebellExercises: Exercise[] = [
      {
        id: uuidv4(),
        name: 'Махи гирей',
        description: 'Поставьте ноги на ширине плеч, возьмите гирю обеими руками и выполняйте махи между ног и вперед до уровня плеч',
        muscleGroups: ['Спина', 'Ягодицы', 'Плечи'],
        sets: 3,
        reps: 15,
        weight: 16,
        restTime: 60,
        difficulty: 'beginner',
        video: '',
        image: '',
        imageUrl: '',
        equipment: ['kettlebell']
      },
      {
        id: uuidv4(),
        name: 'Рывок гири',
        description: 'Рывковым движением поднимите гирю над головой, меняя руки после каждого подхода',
        muscleGroups: ['Плечи', 'Спина', 'Трицепс'],
        sets: 3,
        reps: 10,
        weight: 16,
        restTime: 60,
        difficulty: 'beginner',
        video: '',
        image: '',
        imageUrl: '',
        equipment: ['kettlebell']
      },
      {
        id: uuidv4(),
        name: 'Толчок гири',
        description: 'Поднимите гирю до уровня груди, затем толкните вверх над головой',
        muscleGroups: ['Плечи', 'Грудь', 'Трицепс'],
        sets: 3,
        reps: 10,
        weight: 16,
        restTime: 60,
        difficulty: 'beginner',
        video: '',
        image: '',
        imageUrl: '',
        equipment: ['kettlebell']
      },
      {
        id: uuidv4(),
        name: 'Приседания с гирей',
        description: 'Держите гирю у груди и выполняйте глубокие приседания',
        muscleGroups: ['Квадрицепсы', 'Ягодицы', 'Пресс'],
        sets: 3,
        reps: 12,
        weight: 16,
        restTime: 60,
        difficulty: 'beginner',
        video: '',
        image: '',
        imageUrl: '',
        equipment: ['kettlebell']
      },
      {
        id: uuidv4(),
        name: 'Тяга гири в наклоне',
        description: 'Наклонитесь вперед, держа спину прямой, и тяните гирю к животу',
        muscleGroups: ['Спина', 'Бицепс'],
        sets: 3,
        reps: 12,
        weight: 16,
        restTime: 60,
        difficulty: 'beginner',
        video: '',
        image: '',
        imageUrl: '',
        equipment: ['kettlebell']
      },
      {
        id: uuidv4(),
        name: 'Жим гири',
        description: 'Поднимите гирю до уровня плеча и выжимайте вверх',
        muscleGroups: ['Плечи', 'Трицепс'],
        sets: 3,
        reps: 10,
        weight: 16,
        restTime: 60,
        difficulty: 'beginner',
        video: '',
        image: '',
        imageUrl: '',
        equipment: ['kettlebell']
      }
    ];

    // Создаем тренировки
    const workouts = [
      {
        id: uuidv4(),
        name: 'Тренировка гирями: День 1',
        description: 'Фокус на силу и взрывную мощность',
        exercises: [
          { ...kettlebellExercises[0], restTime: 60 },
          { ...kettlebellExercises[1], restTime: 60 },
          { ...kettlebellExercises[3], restTime: 60 }
        ]
      },
      {
        id: uuidv4(),
        name: 'Тренировка гирями: День 2',
        description: 'Фокус на выносливость и баланс',
        exercises: [
          { ...kettlebellExercises[2], restTime: 60 },
          { ...kettlebellExercises[4], restTime: 60 },
          { ...kettlebellExercises[5], restTime: 60 }
        ]
      },
      {
        id: uuidv4(),
        name: 'Тренировка гирями: День 3',
        description: 'Полная тренировка всего тела',
        exercises: [
          { ...kettlebellExercises[0], restTime: 60 },
          { ...kettlebellExercises[2], restTime: 60 },
          { ...kettlebellExercises[3], restTime: 60 },
          { ...kettlebellExercises[5], restTime: 60 }
        ]
      }
    ];

    // Создаем программу
    const kettlebellProgram: Program = {
      id: uuidv4(),
      name: 'Гиревой тренинг',
      description: 'Программа тренировок с гирями для развития силы, выносливости и функциональности',
      imageUrl: '/images/kettlebell-program.jpg',
      workouts: workouts,
      createdAt: new Date().toISOString(),
      isPublic: true
    };

    // Сохраняем в локальное хранилище
    try {
      const existingPrograms = JSON.parse(localStorage.getItem('programs') || '[]');
      const updatedPrograms = [...existingPrograms, kettlebellProgram];
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      setIsCreated(true);
      
      // Воспроизводим звук успешного создания
      soundManager.playSuccess();
    } catch (error) {
      console.error('Ошибка при сохранении программы:', error);
    }
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
            Данная программа включает 3 тренировочных дня с различными упражнениями с гирями.
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
              <h3>В программу входит:</h3>
              <ul>
                <li>3 тренировочных дня с разным фокусом</li>
                <li>6 базовых упражнений с гирями</li>
                <li>Подробные описания техники выполнения</li>
                <li>Рекомендации по весу и повторениям</li>
              </ul>
            </div>
          </div>
          
          {!isCreated ? (
            <button 
              className={styles.addButton}
              onClick={createKettlebellProgram}
            >
              Добавить программу
            </button>
          ) : (
            <div className={styles.successMessage}>
              <p>Программа успешно добавлена!</p>
              <p>Вы можете найти ее в разделе "Программы".</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddKettlebellProgram; 