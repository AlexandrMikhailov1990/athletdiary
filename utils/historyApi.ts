export async function fetchWorkoutHistory() {
  const res = await fetch('/api/history');
  if (!res.ok) throw new Error('Ошибка загрузки истории тренировок');
  return res.json();
}

export async function saveWorkoutHistory(record: any) {
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Ошибка сохранения тренировки');
  return res.json();
} 