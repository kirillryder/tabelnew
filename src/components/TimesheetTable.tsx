import React, { useMemo } from 'react';
import { useTimesheetStore } from '../store/useTimesheetStore';
import { TimesheetCell } from './TimesheetCell';
import { getDaysInMonth, formatDateKey, isWeekend, getDayName } from '../utils/dateUtils';

export const TimesheetTable: React.FC = () => {
  const { 
    employees, 
    departments,
    entries, 
    selectedYear, 
    selectedMonth,
    searchQuery,
    departmentFilter
  } = useTimesheetStore();

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = !departmentFilter || employee.departmentId === departmentFilter;
      // Exclude dismissed employees from the timesheet view
      const isActive = !employee.isDismissed;
      return matchesSearch && matchesDepartment && isActive;
    });
  }, [employees, searchQuery, departmentFilter]);

  const calculateTotals = (employeeId: string) => {
    let totalHours = 0;
    let salary = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(selectedYear, selectedMonth, day);
      const entry = entries[`${employeeId}-${dateKey}`];
      if (entry) {
        totalHours += entry.hours;
      }
    }
    
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      salary = totalHours * employee.hourlyRate;
    }
    
    return { totalHours, salary };
  };

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || '';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[250px]">
                Сотрудник
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[80px]">
                Подразделение
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const weekend = isWeekend(selectedYear, selectedMonth, day);
                const dayOfWeek = new Date(selectedYear, selectedMonth, day).getDay();
                return (
                  <th 
                    key={day} 
                    className={`px-1 py-2 text-center text-xs font-medium uppercase tracking-wider border-r border-gray-200 min-w-[40px] w-[40px] ${
                      weekend ? 'bg-red-50 text-red-600' : 'text-gray-500'
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px]">{getDayName(dayOfWeek)}</div>
                  </th>
                );
              })}
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 min-w-[60px]">
                Итого часы
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 min-w-[80px]">
                Зарплата
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => {
              const { totalHours, salary } = calculateTotals(employee.id);
              return (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {employee.fullName}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    {getDepartmentName(employee.departmentId)}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                    <TimesheetCell
                      key={day}
                      employeeId={employee.id}
                      year={selectedYear}
                      month={selectedMonth}
                      day={day}
                    />
                  ))}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 bg-blue-50">
                    {totalHours}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-center font-semibold text-green-700 bg-green-50">
                    {salary.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              );
            })}
          </tbody>
          {filteredEmployees.length === 0 && (
            <tfoot>
              <tr>
                <td colSpan={daysInMonth + 4} className="px-4 py-8 text-center text-gray-500">
                  Сотрудники не найдены
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
