import React, { useState } from 'react';
import { useTimesheetStore } from '../store/useTimesheetStore';
import { AttendanceType } from '../types';
import { isWeekend } from '../utils/dateUtils';

interface TimesheetCellProps {
  employeeId: string;
  year: number;
  month: number;
  day: number;
}

const attendanceTypes: { value: AttendanceType; label: string; color: string }[] = [
  { value: '', label: '-', color: 'bg-white' },
  { value: 'Я', label: 'Я (8ч)', color: 'bg-blue-100 text-blue-800' },
  { value: 'Б', label: 'Б (Больничный)', color: 'bg-red-100 text-red-800' },
  { value: 'О', label: 'О (Отпуск)', color: 'bg-green-100 text-green-800' },
  { value: 'К', label: 'К (Командировка)', color: 'bg-purple-100 text-purple-800' },
  { value: 'Н', label: 'Н (Неявка)', color: 'bg-yellow-100 text-yellow-800' },
];

const getTypeHours = (type: AttendanceType): number => {
  switch (type) {
    case 'Я': return 8;
    case 'Б': return 0;
    case 'О': return 0;
    case 'К': return 8;
    case 'Н': return 0;
    default: return 0;
  }
};

export const TimesheetCell: React.FC<TimesheetCellProps> = ({ 
  employeeId, 
  year, 
  month, 
  day 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { entries, updateEntry } = useTimesheetStore();
  
  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const entry = entries[`${employeeId}-${dateKey}`];
  const weekend = isWeekend(year, month, day);
  
  const hours = entry?.hours ?? getTypeHours(entry?.type || '');
  const type = entry?.type || '';
  
  const getCellColor = () => {
    if (weekend) return 'bg-gray-50';
    const typeConfig = attendanceTypes.find(t => t.value === type);
    return typeConfig?.color || 'bg-white';
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as AttendanceType;
    const newHours = newType ? getTypeHours(newType) : 0;
    updateEntry(employeeId, dateKey, newHours, newType);
    setIsEditing(false);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseFloat(e.target.value) || 0;
    updateEntry(employeeId, dateKey, newHours, type);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <td 
      className={`border border-gray-200 p-1 min-w-[40px] w-[40px] h-[36px] ${getCellColor()} hover:bg-opacity-70 cursor-pointer`}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="flex flex-col gap-1">
          <select
            value={type}
            onChange={handleTypeChange}
            onBlur={handleBlur}
            autoFocus
            className="w-full text-xs p-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {attendanceTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={hours}
            onChange={handleHoursChange}
            onBlur={handleBlur}
            className="w-full text-xs p-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0"
            max="24"
            step="0.5"
          />
        </div>
      ) : (
        <div className="text-center">
          {type && (
            <span className="text-xs font-semibold block">{type}</span>
          )}
          {hours > 0 && (
            <span className="text-xs text-gray-600 block">{hours}</span>
          )}
        </div>
      )}
    </td>
  );
};
