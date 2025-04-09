import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { ActiveProgram } from '../models/ActiveProgram';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number; // в секундах
}

interface WorkoutExercise extends Exercise {
  completedSets: number;
  setDetails: {
    reps: number;
    weight?: number;
  }[];
}

export default function Workout() {
  const router = useRouter();
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    {
      id: '1',
      name: 'Приседания',
      sets: 3,
      reps: 12,
      restTime: 90,
      completedSets: 0,
      setDetails: []
    },
    {
      id: '2',
      name: 'Жим лежа',
      sets: 3,
      reps: 10,
      weight: 60,
      restTime: 120,
      completedSets: 0,
      setDetails: []
    },
    // Добавьте больше упражнений по необходимости
  ]);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    // Загружаем активную программу
    const savedProgram = localStorage.getItem('activeProgram');
    if (!savedProgram) {
      router.push('/programs');
      return;
    }

    const activeProgramData = JSON.parse(savedProgram) as ActiveProgram;
    setActiveProgram(activeProgramData);

    const programData = SAMPLE_PROGRAMS.find(p => p.id === activeProgramData.programId);
    if (programData) {
      setProgram(programData);
    }
  }, [router]);

  useEffect(() => {
    if (isResting && restTimer !== null && restTimer > 0) {
      const timer = setTimeout(() => {
        setRestTimer(restTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(null);
    }
  }, [isResting, restTimer]);

  const handleSetComplete = (weight?: number, completedReps?: number) => {
    const currentExercise = exercises[currentExerciseIndex];
    const updatedExercises = [...exercises];
    
    updatedExercises[currentExerciseIndex] = {
      ...currentExercise,
      completedSets: currentExercise.completedSets + 1,
      setDetails: [
        ...currentExercise.setDetails,
        {
          reps: completedReps || currentExercise.reps,
          weight: weight || currentExercise.weight
        }
      ]
    };

    setExercises(updatedExercises);

    if (currentExercise.completedSets + 1 < currentExercise.sets) {
      // Если есть еще сеты, начинаем отдых
      setRestTimer(currentExercise.restTime);
      setIsResting(true);
    } else if (currentExerciseIndex + 1 < exercises.length) {
      // Переходим к следующему упражнению
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Тренировка завершена
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    if (activeProgram && program) {
      const updatedProgram = {
        ...activeProgram,
        completedWorkouts: [
          ...activeProgram.completedWorkouts,
          {
            week: activeProgram.currentWeek,
            day: activeProgram.currentDay,
            date: new Date().toISOString()
          }
        ],
        currentDay: activeProgram.currentDay + 1
      };

      // Если текущий день превышает количество тренировок в неделю, переходим к следующей неделе
      if (updatedProgram.currentDay > program.workoutsPerWeek) {
        updatedProgram.currentWeek += 1;
        updatedProgram.currentDay = 1;
      }

      localStorage.setItem('activeProgram', JSON.stringify(updatedProgram));
      router.push('/active-program');
    }
  };

  if (!activeProgram || !program) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка тренировки...</p>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            Тренировка: Неделя {activeProgram.currentWeek}, День {activeProgram.currentDay}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-800">
                {currentExercise.name}
              </h2>
              <span className="text-gray-600">
                {currentExerciseIndex + 1} / {exercises.length}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {currentExercise.sets}
                  </div>
                  <div className="text-gray-600">Подходов</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {currentExercise.reps}
                  </div>
                  <div className="text-gray-600">Повторений</div>
                </div>
              </div>

              {currentExercise.weight && (
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {currentExercise.weight} кг
                  </div>
                  <div className="text-gray-600">Вес</div>
                </div>
              )}

              {isResting ? (
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    Отдых: {restTimer}с
                  </div>
                  <p className="text-gray-600">
                    Следующий подход: {currentExercise.completedSets + 1} / {currentExercise.sets}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    Подход {currentExercise.completedSets + 1} / {currentExercise.sets}
                  </p>
                  
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold"
                    onClick={() => handleSetComplete()}
                  >
                    Завершить подход
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              className="text-red-600 hover:text-red-700 font-semibold"
              onClick={() => {
                if (confirm('Вы уверены, что хотите прервать тренировку? Прогресс не будет сохранен.')) {
                  router.push('/active-program');
                }
              }}
            >
              Прервать тренировку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 