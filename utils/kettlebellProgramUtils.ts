import { KETTLEBELL_DAILY_PROGRAM } from '../models/KettlebellProgram';

/**
 * Утилита для обновления гиревой программы
 * Заменяет функциональность API роута для работы со статическим экспортом
 */
export async function updateKettlebellProgram() {
  try {
    // Обновление можно делать напрямую в клиентском коде
    // Имитируем асинхронный вызов для совместимости с предыдущим кодом
    return {
      success: true,
      message: 'Актуальная программа получена успешно',
      updated: ['Программа на каждый день с гирей'],
      program: KETTLEBELL_DAILY_PROGRAM
    };
  } catch (error) {
    console.error('Ошибка при обновлении программы:', error);
    return {
      success: false,
      message: 'Произошла ошибка при обновлении программы'
    };
  }
} 