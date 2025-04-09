export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  createdAt: string; // ISO format
  stats?: UserStats;
}

export interface UserStats {
  totalWorkouts: number;
  totalExercises: number;
  totalDuration: number; // В минутах
  startDate: string; // ISO format
  longestStreak: number; // В днях
  currentStreak: number; // В днях
}

// Пример пользователя
export const SAMPLE_USER: User = {
  id: 'user123',
  username: 'sportsman',
  email: 'user@example.com',
  firstName: 'Иван',
  lastName: 'Петров',
  profilePicture: '/images/avatar.jpg',
  createdAt: '2023-01-15T12:00:00Z',
  stats: {
    totalWorkouts: 87,
    totalExercises: 657,
    totalDuration: 6570, // примерно 110 часов
    startDate: '2023-01-15T12:00:00Z',
    longestStreak: 21,
    currentStreak: 5
  }
}; 