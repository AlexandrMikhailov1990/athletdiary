import React from 'react';
import { updateKettlebellProgram } from '../../utils/kettlebellProgramUtils';

interface KettlebellProgramUpdaterProps {
  onUpdate: (result: any) => void;
}

/**
 * Компонент для обновления гиревой программы
 * Заменяет API роут для статического экспорта
 */
const KettlebellProgramUpdater: React.FC<KettlebellProgramUpdaterProps> = ({ onUpdate }) => {
  const handleUpdate = async () => {
    try {
      const result = await updateKettlebellProgram();
      onUpdate(result);
    } catch (error) {
      console.error('Ошибка при обновлении программы:', error);
      onUpdate({
        success: false,
        message: 'Произошла ошибка при обновлении программы'
      });
    }
  };

  return (
    <button 
      onClick={handleUpdate}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Обновить гиревую программу
    </button>
  );
};

export default KettlebellProgramUpdater; 