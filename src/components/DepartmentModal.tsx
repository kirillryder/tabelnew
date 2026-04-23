import React, { useState } from 'react';
import { useTimesheetStore } from '../store/useTimesheetStore';

export const DepartmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
