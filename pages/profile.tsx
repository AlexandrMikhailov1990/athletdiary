import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPrograms, Program } from '../models/Program';
import { useRouter } from 'next/router';
import { fetchWorkoutHistory } from '../utils/historyApi';

// Тип анкеты пользователя
interface ProfileForm {
  name: string;
  email: string;
  birthDate?: string;
  gender?: string;
  city?: string;
  goals?: string;
  bio?: string;
}

// Получение завершённых упражнений
function getCompletedExercises() {
  if (typeof window === 'undefined') return [];
  const completedWorkouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
  let allExercises: any[] = [];
  completedWorkouts.forEach((workout: any) => {
    workout.exercises.forEach((ex: any) => {
      allExercises.push({
        ...ex,
        date: workout.date,
        programId: workout.programId,
        workoutId: workout.workoutId,
      });
    });
  });
  return allExercises;
}

function getUniqueExerciseNames(exercises: any[]) {
  const names = new Set<string>();
  exercises.forEach(ex => {
    if (ex.exercise?.name) names.add(ex.exercise.name);
    else if (ex.name) names.add(ex.name);
  });
  return Array.from(names);
}

function getTopExercises(exercises: any[], topN = 3) {
  const freq: Record<string, number> = {};
  exercises.forEach(ex => {
    const name = ex.exercise?.name || ex.name || 'Упражнение';
    freq[name] = (freq[name] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

function getCategoryStats(exercises: any[]) {
  const stats: Record<string, number> = {};
  exercises.forEach(ex => {
    const cats = ex.exercise?.muscleGroups || ex.muscleGroups || [];
    cats.forEach((cat: string) => {
      stats[cat] = (stats[cat] || 0) + 1;
    });
  });
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
}

// Получение завершённых тренировок
function getCompletedWorkouts() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('workoutHistory') || '[]');
}

// Маппинг категорий мышц на русский
const muscleGroupMap: Record<string, string> = {
  shoulders: 'Плечи',
  core: 'Кор',
  biceps: 'Бицепсы',
  glutes: 'Ягодицы',
  hamstrings: 'Бицепсы бедра',
  back: 'Спина',
  quads: 'Квадрицепсы',
  forearms: 'Предплечья',
  cardio: 'Кардио',
  calves: 'Икры',
  arms: 'Руки',
  deltoids: 'Дельтовидные',
  triceps: 'Трицепсы',
};

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [editMode, setEditMode] = useState(false);
  const user = session?.user as ProfileForm & { favorites?: string[] };
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    birthDate: '',
    gender: '',
    city: '',
    goals: '',
    bio: '',
  });
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [favoritePrograms, setFavoritePrograms] = useState<Program[]>([]);
  const [completedExercises, setCompletedExercises] = useState<any[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<any[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const router = useRouter();

  // Обновляем форму, когда сессия становится доступной или изменяется
  useEffect(() => {
    if (session?.user) {
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        birthDate: user?.birthDate || '',
        gender: user?.gender || '',
        city: user?.city || '',
        goals: user?.goals || '',
        bio: user?.bio || '',
      });
    }
  }, [session, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favoritePrograms') || '[]');
      const allPrograms = getPrograms();
      setFavoritePrograms(allPrograms.filter((p: any) => favorites.includes(p.id)));
    }
  }, []);

  useEffect(() => {
    async function loadHistory() {
      try {
        const workouts = await fetchWorkoutHistory();
        setCompletedWorkouts(workouts);
        // Собираем все упражнения из тренировок
        let allExercises: any[] = [];
        workouts.forEach((workout: any) => {
          (workout.exercises || []).forEach((ex: any) => {
            allExercises.push({
              ...ex,
              date: workout.date,
              programId: workout.programId,
              workoutId: workout.id,
            });
          });
        });
        setCompletedExercises(allExercises);
      } catch (e) {
        setCompletedWorkouts([]);
        setCompletedExercises([]);
      }
      setIsClientLoaded(true);
    }
    loadHistory();
  }, []);

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    try {
      console.log('Отправляемые данные:', form);
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('Ответ сервера:', data);
        setEditMode(false);
        setSaveSuccess('Профиль успешно обновлён!');
        if (update) await update(); // обновить сессию NextAuth
      } else {
        const errorData = await res.json().catch(() => null);
        console.error('Ошибка сервера:', errorData || res.statusText);
        setSaveError(`Ошибка при сохранении профиля: ${errorData?.error || res.statusText}`);
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
      setSaveError('Произошла ошибка при отправке запроса');
    }
  };

  // Удалить из избранного
  const handleRemoveFavorite = (programId: string) => {
    const favorites = JSON.parse(localStorage.getItem('favoritePrograms') || '[]');
    const updated = favorites.filter((id: string) => id !== programId);
    localStorage.setItem('favoritePrograms', JSON.stringify(updated));
    const allPrograms = getPrograms();
    setFavoritePrograms(allPrograms.filter((p: any) => updated.includes(p.id)));
  };

  // Начать программу (копия из programs.tsx)
  const handleStartProgram = (program: Program) => {
    try {
      import('../models/HomeExercises').then(module => {
        if (typeof module.addHomeExercisesToUserExercises === 'function') {
          module.addHomeExercisesToUserExercises();
        }
      });
      import('../models/HomeExercisesExtended').then(module => {
        if (typeof module.addExtendedHomeExercises === 'function') {
          module.addExtendedHomeExercises();
        }
      });
      const programWithExercises = {
        ...program,
        exercises: program.exercises || (
          program.workouts && program.workouts.length > 0
            ? program.workouts.flatMap(workout => workout.exercises)
            : []
        )
      };
      const newActiveProgram = {
        programId: program.id,
        userId: 'user',
        startDate: new Date().toISOString(),
        currentWeek: 1,
        currentDay: 1,
        completedWorkouts: []
      };
      localStorage.setItem('activeProgram', JSON.stringify(newActiveProgram));
      const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]');
      activePrograms.push({
        ...newActiveProgram,
        program: programWithExercises
      });
      localStorage.setItem('activePrograms', JSON.stringify(activePrograms));
      router.push('/active-program');
    } catch (error) {
      alert('Произошла ошибка при запуске программы. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full mb-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-700 font-bold mb-4">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Имя</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Дата рождения</label>
                <input name="birthDate" type="date" value={form.birthDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Пол</label>
                <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">Не выбрано</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Город</label>
                <input name="city" value={form.city || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Цели</label>
                <input name="goals" value={form.goals || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">О себе</label>
              <textarea name="bio" value={form.bio || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={3} />
            </div>
            {saveError && <div className="text-red-600">{saveError}</div>}
            {saveSuccess && <div className="text-green-600">{saveSuccess}</div>}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 text-white py-2 px-4 rounded">Отмена</button>
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Сохранить</button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-500">Дата рождения:</span> {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : '—'}
              </div>
              <div>
                <span className="text-gray-500">Пол:</span> {user?.gender || '—'}
              </div>
              <div>
                <span className="text-gray-500">Город:</span> {user?.city || '—'}
              </div>
              <div>
                <span className="text-gray-500">Цели:</span> {user?.goals || '—'}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-gray-500">О себе:</span>
              <div className="whitespace-pre-line">{user?.bio || '—'}</div>
            </div>
            <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white py-2 px-4 rounded mb-4">Редактировать анкету</button>
            <Link href="/settings" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mb-4 ml-2 transition">Настройки</Link>
            {saveError && (
              <div className="mt-2 mb-2">
                <div className="text-red-600">{saveError}</div>
                <button
                  onClick={async () => { if (update) await update(); }}
                  className="mt-1 bg-green-600 text-white py-1 px-3 rounded text-sm"
                >
                  Обновить сессию
                </button>
                <div className="mt-1 text-xs text-gray-500">
                  ID: {session?.user?.id || 'Отсутствует'}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full max-w-xl bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition mb-8"
      >
        Выйти
      </button>

      {/* Избранные программы */}
      {favoritePrograms.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full mb-8">
          <h3 className="text-xl font-bold mb-2">Избранные программы</h3>
          <ul className="list-disc pl-6 text-gray-700">
            {favoritePrograms.map((p: Program) => (
              <li key={p.id} className="flex items-center gap-2 mb-1">
                <Link href={`/programs/${p.id}`} className="text-blue-700 hover:underline flex-1">{p.name}</Link>
                <button
                  className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1"
                  title="Начать"
                  onClick={() => handleStartProgram(p)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  Начать
                </button>
                <button
                  className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1"
                  title="Удалить из избранного"
                  onClick={() => handleRemoveFavorite(p.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Статистика */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full mb-8">
        <h3 className="text-xl font-bold mb-2">Статистика</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center bg-blue-50 rounded-lg p-4">
            <span className="text-3xl text-blue-600 mb-1">🏆</span>
            <span className="text-2xl font-bold text-blue-800">{completedExercises.length}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">Всего завершённых упражнений</span>
          </div>
          <div className="flex flex-col items-center bg-green-50 rounded-lg p-4">
            <span className="text-3xl text-green-600 mb-1">💪</span>
            <span className="text-2xl font-bold text-green-800">{getUniqueExerciseNames(completedExercises).length}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">Уникальных упражнений</span>
          </div>
          <div className="flex flex-col items-center bg-yellow-50 rounded-lg p-4">
            <span className="text-3xl text-yellow-600 mb-1">🔥</span>
            <span className="text-2xl font-bold text-yellow-800">{getTopExercises(completedExercises, 1)[0]?.count || 0}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">Самое частое упражнение</span>
            <span className="text-xs text-yellow-700 font-semibold mt-1">{getTopExercises(completedExercises, 1)[0]?.name || '—'}</span>
          </div>
        </div>
        {/* Топ-3 упражнений */}
        <div className="mb-6">
          <div className="mb-2 font-medium text-gray-700">Топ-3 ваших упражнения</div>
          <ol className="list-decimal pl-6 text-gray-800 space-y-1">
            {getTopExercises(completedExercises, 3).map((ex, idx) => (
              <li key={ex.name} className="flex items-center gap-2">
                <span className="font-semibold">{ex.name}</span>
                <span className="text-xs text-gray-500">{ex.count} раз</span>
              </li>
            ))}
            {getTopExercises(completedExercises, 3).length === 0 && (
              isClientLoaded ? <li className="text-gray-400">Нет данных</li> : null
            )}
          </ol>
        </div>
        {/* Аналитика по категориям */}
        <div className="mb-6">
          <div className="mb-2 font-medium text-gray-700">Ваша активность по категориям</div>
          <div className="flex flex-wrap gap-2">
            {getCategoryStats(completedExercises).map(cat => (
              <div key={cat.category} className="flex flex-col items-center bg-gray-100 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-blue-700">{muscleGroupMap[cat.category] || cat.category}</span>
                <span className="text-xs text-gray-500">{cat.count} раз</span>
              </div>
            ))}
            {getCategoryStats(completedExercises).length === 0 && (
              isClientLoaded ? <span className="text-gray-400">Нет данных</span> : null
            )}
          </div>
        </div>
        {/* Последние упражнения */}
        <div className="mb-2 font-medium text-gray-700">Последние упражнения</div>
        <ul className="divide-y divide-gray-200">
          {completedExercises.slice(-5).reverse().map((ex, idx) => (
            <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="font-semibold text-gray-800">{ex.exercise?.name || ex.name || 'Упражнение'}</span>
              <span className="text-gray-500 text-xs">{ex.date ? new Date(ex.date).toLocaleDateString() : ''}</span>
              {ex.reps && (
                <span className="ml-auto text-xs text-blue-700">{ex.reps} повторений</span>
              )}
              {ex.duration && !ex.reps && (
                <span className="ml-auto text-xs text-blue-700">{ex.duration} сек</span>
              )}
              {ex.weight && (
                <span className="ml-2 text-xs text-green-700">{ex.weight} кг</span>
              )}
            </li>
          ))}
          {completedExercises.length === 0 && (
            isClientLoaded ? <li className="py-2 text-gray-400">Нет завершённых упражнений</li> : null
          )}
        </ul>
      </div>

      {/* Последние тренировки */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full mb-8">
        <h3 className="text-xl font-bold mb-2">Последние тренировки</h3>
        <ul className="text-gray-700">
          {completedWorkouts.slice(-5).reverse().map((workout, idx) => {
            const totalReps = workout.exercises.reduce((sum: number, ex: any) => sum + (ex.reps || 0), 0);
            const totalWeight = workout.exercises.reduce((sum: number, ex: any) => sum + (ex.weight ? (ex.weight * (ex.reps || 1)) : 0), 0);
            return (
              <li key={idx} className="mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0 w-full">
                    <span className="font-semibold text-gray-800 shrink-0">{workout.date ? new Date(workout.date).toLocaleDateString() : ''}</span>
                    <span className="text-blue-700 text-sm truncate block max-w-xs sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl" title={workout.programName || 'Без программы'}>{workout.programName || 'Без программы'}</span>
                  </div>
                  <div className="flex flex-row flex-wrap items-center gap-2 mt-1 sm:mt-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">{workout.exercises.length} упражнений</span>
                    {totalReps > 0 && (
                      <span className="text-xs text-green-700 whitespace-nowrap">{totalReps} повторений</span>
                    )}
                    {totalWeight > 0 && (
                      <span className="text-xs text-yellow-700 whitespace-nowrap">{totalWeight} кг</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {completedWorkouts.length === 0 && (
            isClientLoaded ? <li>Нет данных</li> : null
          )}
        </ul>
      </div>
    </div>
  );
} 