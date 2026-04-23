import React, { useMemo } from 'react';
import { useTimesheetStore } from '../store/useTimesheetStore';

export const PaymentsPage: React.FC = () => {
  const { employees, departments, selectedYear, selectedMonth, payments, recordPayment } = useTimesheetStore();
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  // Calculate salary for each employee for the selected month
  const calculateSalary = (employeeId: string) => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    let totalHours = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = Object.values(useTimesheetStore.getState().entries).find(
        e => e.employeeId === employeeId && e.date === dateKey
      );
      if (entry) {
        totalHours += entry.hours;
      }
    }
    
    const employee = employees.find(e => e.id === employeeId);
    return { hours: totalHours, salary: totalHours * (employee?.hourlyRate || 0) };
  };

  const paymentData = useMemo(() => {
    return employees.map(employee => {
      const { hours, salary } = calculateSalary(employee.id);
      const dept = departments.find(d => d.id === employee.departmentId);
      const existingPayments = payments.filter(
        p => p.employeeId === employee.id && p.year === selectedYear && p.month === selectedMonth
      );
      const totalPaid = existingPayments.reduce((sum, p) => sum + p.amountPaid, 0);
      
      return {
        employee,
        department: dept?.name || '',
        hours,
        salary,
        paid: totalPaid,
        due: salary - totalPaid,
        payments: existingPayments,
      };
    });
  }, [employees, departments, selectedYear, selectedMonth, payments]);

  const handleRecordPayment = (employeeId: string, amount: number, method: 'transfer' | 'cash') => {
    recordPayment({
      employeeId,
      year: selectedYear,
      month: selectedMonth,
      amountDue: paymentData.find(p => p.employee.id === employeeId)?.salary || 0,
      amountPaid: amount,
      paymentMethod: method,
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setShowPaymentModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Ведомость выплат</h2>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Зафиксировать выплату
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудник</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Подразделение</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Отработано часов</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Начислено</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Выплачено</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">К выплате</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentData.map(({ employee, department, hours, salary, paid, due, payments }) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{employee.fullName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{department}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{hours}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                  {salary.toLocaleString('ru-RU')} ₽
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-green-700">
                  {paid.toLocaleString('ru-RU')} ₽
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-center font-semibold ${
                  due > 0 ? 'text-red-600' : 'text-green-700'
                }`}>
                  {due > 0 ? `${due.toLocaleString('ru-RU')} ₽` : 'Полностью'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {payments.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {payments.map((payment) => (
                        <span
                          key={payment.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.paymentMethod === 'transfer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.paymentMethod === 'transfer' ? 'Перевод' : 'Наличные'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Нет выплат</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPaymentModal && (
        <PaymentModal
          employees={employees}
          paymentData={paymentData}
          onClose={() => setShowPaymentModal(false)}
          onPay={handleRecordPayment}
        />
      )}
    </div>
  );
};

interface PaymentModalProps {
  employees: Array<{ id: string; fullName: string }>;
  paymentData: Array<{ employee: { id: string; fullName: string }; salary: number; due: number }>;
  onClose: () => void;
  onPay: (employeeId: string, amount: number, method: 'transfer' | 'cash') => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ employees, paymentData, onClose, onPay }) => {
  const [employeeId, setEmployeeId] = React.useState(employees[0]?.id || '');
  const [amount, setAmount] = React.useState('');
  const [method, setMethod] = React.useState<'transfer' | 'cash'>('transfer');

  const selectedDue = paymentData.find(p => p.employee.id === employeeId)?.due || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payAmount = parseFloat(amount) || selectedDue;
    onPay(employeeId, payAmount, method);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Зафиксировать выплату</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
            <select
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                const due = paymentData.find(p => p.employee.id === e.target.value)?.due || 0;
                setAmount(due.toString());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Сумма выплаты (₽)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={selectedDue.toString()}
            />
            {selectedDue > 0 && (
              <p className="text-sm text-gray-500 mt-1">К выплате: {selectedDue.toLocaleString('ru-RU')} ₽</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Метод выплаты</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked={method === 'transfer'}
                  onChange={() => setMethod('transfer')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Банковский перевод</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={method === 'cash'}
                  onChange={() => setMethod('cash')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Наличные</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Подтвердить
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
