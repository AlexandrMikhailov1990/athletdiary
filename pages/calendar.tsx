import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Calendar from '@/components/Calendar';
import { WorkoutHistory, PlannedWorkout } from '../models/WorkoutHistory';

export default function CalendarPage() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([]);
  
  useEffect(() => {
    // Загрузка истории тренировок из localStorage
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory));
    }
    
    // Загрузка запланированных тренировок
    const savedPlannedWorkouts = localStorage.getItem('plannedWorkouts');
    if (savedPlannedWorkouts) {
      setPlannedWorkouts(JSON.parse(savedPlannedWorkouts));
    }
  }, []);
  
  // Сохранение запланированных тренировок
  const savePlannedWorkouts = (updatedWorkouts: PlannedWorkout[]) => {
    localStorage.setItem('plannedWorkouts', JSON.stringify(updatedWorkouts));
    setPlannedWorkouts(updatedWorkouts);
  };

  return (
    <Layout title="Календарь тренировок">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 flex items-center mt-6">
          <svg className="w-6 h-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Календарь тренировок
        </h1>
        
        <Calendar 
          workoutHistory={workoutHistory} 
          plannedWorkouts={plannedWorkouts} 
          onUpdatePlannedWorkouts={savePlannedWorkouts} 
        />
      </div>
    </Layout>
  );
} 