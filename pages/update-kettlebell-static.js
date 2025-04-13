import { useEffect } from 'react';
import Head from 'next/head';

export default function UpdateKettlebellStatic() {
  // Используем тот же скрипт, что и в HTML-файле
  useEffect(() => {
    // Добавляем обработчик для кнопки обновления, когда компонент монтируется
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
      updateButton.addEventListener('click', function() {
        try {
          // Создаем объект программы с правильными параметрами
          const kettlebellProgram = {
            "id": "kettlebell_program_fixed",
            "name": "Программа на каждый день с гирей",
            "description": "Эффективная программа с использованием гири и подтягиваний для тренировки всего тела на каждый день.",
            "createdBy": "system",
            "isPublic": true,
            "restBetweenExercises": 60,
            "workouts": [
              {
                "id": "kettlebell_workout_fixed",
                "programId": "kettlebell_program_fixed",
                "name": "Тренировка с гирей и подтягиваниями",
                "exercises": [
                  {
                    "id": "ke1",
                    "exerciseId": "pullup1",
                    "exercise": {
                      "id": "pullup1",
                      "name": "Подтягивания прямым хватом",
                      "description": "Классические подтягивания на перекладине прямым хватом.",
                      "imageUrl": "/images/exercises/pullup-regular.jpg",
                      "muscleGroups": ["back", "biceps", "forearms"],
                      "equipment": ["pullup_bar"],
                      "difficulty": "intermediate",
                      "type": "reps",
                      "restTime": 60,
                      "isPublic": true
                    },
                    "sets": 3,
                    "rest": 60,
                    "reps": 5
                  },
                  {
                    "id": "ke2",
                    "exerciseId": "27",
                    "exercise": {
                      "id": "27",
                      "name": "Круговые движения гирей",
                      "description": "Упражнение для укрепления плеч и мышц кора. Гиря выполняет круговое движение вокруг тела.",
                      "imageUrl": "/images/exercises/kettlebell-around.jpg",
                      "muscleGroups": ["shoulders", "core", "arms"],
                      "equipment": ["kettlebell"],
                      "difficulty": "beginner",
                      "type": "timed",
                      "duration": 30,
                      "restTime": 10,
                      "isPublic": true
                    },
                    "sets": 2,
                    "rest": 10,
                    "duration": 30
                  },
                  {
                    "id": "ke3",
                    "exerciseId": "20",
                    "exercise": {
                      "id": "20",
                      "name": "Махи гирей (свинг)",
                      "description": "Базовое упражнение с гирей, которое задействует всё тело с акцентом на ягодицы, заднюю поверхность бедра и кор.",
                      "imageUrl": "/images/exercises/kettlebell-swing.jpg",
                      "muscleGroups": ["glutes", "hamstrings", "core", "shoulders"],
                      "equipment": ["kettlebell"],
                      "difficulty": "beginner",
                      "type": "reps",
                      "sets": 3,
                      "reps": 15,
                      "restTime": 60,
                      "isPublic": true
                    },
                    "sets": 3,
                    "rest": 60,
                    "reps": 10
                  },
                  {
                    "id": "ke4",
                    "exerciseId": "23",
                    "exercise": {
                      "id": "23",
                      "name": "Приседания с гирей",
                      "description": "Приседания с гирей, удерживаемой у груди или в вытянутых руках перед собой. Отлично прорабатывает ноги и стабилизирующие мышцы.",
                      "imageUrl": "/images/exercises/kettlebell-squat.jpg",
                      "muscleGroups": ["quads", "glutes", "hamstrings", "core"],
                      "equipment": ["kettlebell"],
                      "difficulty": "beginner",
                      "type": "reps",
                      "reps": 12,
                      "restTime": 60,
                      "isPublic": true
                    },
                    "sets": 3,
                    "rest": 60,
                    "reps": 10
                  }
                ]
              }
            ]
          };

          // Получаем существующие программы из localStorage
          const storageKeys = ['programs', 'userPrograms'];
          let updatedStorages = [];
          
          storageKeys.forEach(key => {
            const programsJson = localStorage.getItem(key);
            if (programsJson) {
              let programs = JSON.parse(programsJson);
              
              // Удаляем программу с таким же именем
              const filteredPrograms = programs.filter(p => p.name !== kettlebellProgram.name);
              if (filteredPrograms.length !== programs.length) {
                updatedStorages.push(`удалена из ${key}`);
              }
              
              // Добавляем новую программу
              filteredPrograms.push(kettlebellProgram);
              localStorage.setItem(key, JSON.stringify(filteredPrograms));
              updatedStorages.push(`добавлена в ${key}`);
            }
          });
          
          // Проверяем активную программу
          const activeProgramJson = localStorage.getItem('activeProgram');
          if (activeProgramJson) {
            const activeProgram = JSON.parse(activeProgramJson);
            if (activeProgram.name === kettlebellProgram.name) {
              // Если это активная программа, сохраняем прогресс
              localStorage.removeItem('activeProgram'); // Сначала удаляем
              updatedStorages.push('активная программа сброшена');
            }
          }
          
          const messageEl = document.getElementById('message');
          if (messageEl) {
            messageEl.textContent = updatedStorages.length > 0 
              ? `Программа успешно обновлена: ${updatedStorages.join(', ')}` 
              : 'Программа не найдена в локальном хранилище';
            messageEl.style.display = 'block';
          }
          
        } catch (error) {
          console.error('Ошибка при обновлении программы:', error);
          const messageEl = document.getElementById('message');
          if (messageEl) {
            messageEl.textContent = 'Произошла ошибка при обновлении программы.';
            messageEl.style.display = 'block';
          }
        }
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Обновление программы с гирей | АтлетДиари</title>
        <meta name="description" content="Обновление программы тренировок с гирей" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 transform -skew-y-6 z-0"></div>
          <div className="relative z-10 p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Обновление программы с гирей</h1>
            <p className="text-gray-700 text-center mb-6">
              Нажмите кнопку для удаления и добавления заново программы "Программа на каждый день с гирей" с правильными параметрами.
            </p>
            
            <div id="message" className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 hidden"></div>
            
            <button
              id="updateButton"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Обновить программу
            </button>
            
            <div className="mt-6 flex justify-center space-x-6">
              <a href="/programs/" className="text-blue-600 hover:text-blue-800">К программам</a>
              <a href="/" className="text-blue-600 hover:text-blue-800">На главную</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 