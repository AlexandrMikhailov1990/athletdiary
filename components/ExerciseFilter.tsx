import React from 'react';
import { Exercise } from '../models/Exercise';
import { translateEquipment } from '../models/Exercise';

interface ExerciseFilterProps {
  exercises: Exercise[];
  selectedEquipment: string[];
  onFilterChange: (equipment: string[]) => void;
}

const ExerciseFilter: React.FC<ExerciseFilterProps> = ({
  exercises,
  selectedEquipment,
  onFilterChange
}) => {
  // Получаем уникальный список всего доступного инвентаря
  const allEquipment = React.useMemo(() => {
    const equipmentSet = new Set<string>();
    exercises.forEach(exercise => {
      if (exercise.equipment) {
        exercise.equipment.forEach(item => equipmentSet.add(item));
      }
    });
    return Array.from(equipmentSet).sort((a, b) => 
      translateEquipment(a).localeCompare(translateEquipment(b))
    );
  }, [exercises]);

  // Обработчик изменения фильтра
  const handleEquipmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "") {
      onFilterChange([]);
    } else {
      onFilterChange([value]);
    }
  };

  if (allEquipment.length === 0) {
    return null;
  }

  return (
    <select
      value={selectedEquipment[0] || ""}
      onChange={handleEquipmentChange}
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Весь инвентарь</option>
      {allEquipment.map(equipment => (
        <option key={equipment} value={equipment}>
          {translateEquipment(equipment)}
        </option>
      ))}
    </select>
  );
};

export default ExerciseFilter; 