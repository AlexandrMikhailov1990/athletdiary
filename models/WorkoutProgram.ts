export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number; // Rest time between sets in seconds
  tempo?: {
    eccentric: number; // Negative/lowering phase in seconds
    pause: number;     // Pause at bottom in seconds
    concentric: number; // Positive/lifting phase in seconds
    holdTop: number;    // Hold at top in seconds
  };
  notes?: string;
  technique?: string;
  videoUrl?: string;
  equipment: string[]; // Required equipment for the exercise
  category: string[]; // Exercise categories (e.g., cardio, strength, etc.)
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
  totalDuration?: number; // Estimated total duration in minutes
  restBetweenExercises: number; // Rest time between exercises in seconds
  notes?: string;
  warmupRoutine?: string;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description?: string;
  days: WorkoutDay[];
  author?: string;
  difficulty: 'начальный' | 'средний' | 'продвинутый';
  category: string[]; // Target muscle groups/training type
  estimatedDuration: number; // Total program duration in minutes
  equipment: string[]; // Required equipment
  frequency?: number; // Recommended workouts per week
  restDaysBetweenWorkouts?: number; // Recommended rest days between workouts
  prerequisites?: string[]; // Required fitness level or prior experience
  goals?: string[]; // Program goals (e.g., strength, hypertrophy, endurance)
  progressionStrategy?: string; // How the program progresses over time
  version: string; // Program version for tracking updates
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
} 