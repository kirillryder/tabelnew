import React, { useState } from 'react';
import { useTimesheetStore } from '../store/useTimesheetStore';

export const EmployeesPage: React.FC = () => {
  const { employees, departments, deleteEmployee, deleteDepartment } = useTimesheetStore();
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || '';
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить сотрудника?')) {
      deleteEmployee(id);
    }
  };

  const handleDeleteDepartment = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить подразделение?')) {
      deleteDepartment(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Departments Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Подразделения</h2>
          <button
            onClick={() => setShowDepartmentModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Добавить подразделение
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Родительское</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудников</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => {
                const parentDept = dept.parentDepartmentId ? departments.find(d => d.id === dept.parentDepartmentId) : null;
                const employeeCount = employees.filter(e => e.departmentId === dept.id).length;
                return (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {parentDept?.name || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{employeeCount}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                );
              })}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Подразделения не созданы
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Сотрудники</h2>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setShowEmployeeModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Добавить сотрудника
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Возраст</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Подразделение</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ставка (₽/час)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата приема</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{employee.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{employee.age}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{getDepartmentName(employee.departmentId)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.hourlyRate.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{employee.hireDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingEmployee(employee.id);
                        setShowEmployeeModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Сотрудники не добавлены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEmployeeModal && (
        <EmployeeFormModal
          employeeId={editingEmployee}
          onClose={() => {
            setShowEmployeeModal(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {showDepartmentModal && (
        <DepartmentFormModal onClose={() => setShowDepartmentModal(false)} />
      )}
    </div>
  );
};

interface EmployeeFormModalProps {
  employeeId: string | null;
  onClose: () => void;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employeeId, onClose }) => {
  const { departments, addEmployee, updateEmployee } = useTimesheetStore();
  const existingEmployee = employeeId ? useTimesheetStore.getState().employees.find(e => e.id === employeeId) : null;

  const [formData, setFormData] = useState({
    fullName: existingEmployee?.fullName || '',
    age: existingEmployee?.age || 18,
    departmentId: existingEmployee?.departmentId || departments[0]?.id || '',
    hourlyRate: existingEmployee?.hourlyRate || 0,
    hireDate: existingEmployee?.hireDate || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      updateEmployee(employeeId, formData);
    } else {
      addEmployee(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {employeeId ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
            <input
              type="number"
              required
              min="18"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Подразделение</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ставка (₽/час)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата приема</label>
            <input
              type="date"
              required
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DepartmentFormModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { departments, addDepartment } = useTimesheetStore();
  const [formData, setFormData] = useState({
    name: '',
    parentDepartmentId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment(formData.name, formData.parentDepartmentId || undefined);
    onClose();
  };

  const rootDepartments = departments.filter(d => !d.parentDepartmentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Добавить подразделение</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название подразделения</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Родительское подразделение (опционально)</label>
            <select
              value={formData.parentDepartmentId}
              onChange={(e) => setFormData({ ...formData, parentDepartmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Нет (корневое)</option>
              {rootDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
