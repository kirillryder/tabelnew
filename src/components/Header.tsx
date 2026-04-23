import React from 'react';
import { useTimesheetStore } from '../store/useTimesheetStore';

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

export const Header: React.FC = () => {
  const { 
    selectedYear, 
    selectedMonth, 
    setYear, 
    setMonth, 
    searchQuery, 
    setSearchQuery,
    departmentFilter,
    setDepartmentFilter,
    getDepartments
  } = useTimesheetStore();

  const departments = getDepartments();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 mb-6">
      <div className="max-w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Электронный Табель</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Поиск по ФИО..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Все подразделения</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
