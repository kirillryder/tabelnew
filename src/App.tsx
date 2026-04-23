import React, { useState } from 'react';
import { Header, TimesheetTable, EmployeesPage, PaymentsPage } from './components';

type Page = 'timesheet' | 'employees' | 'payments';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('timesheet');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-full mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('timesheet')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                currentPage === 'timesheet'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Табель
            </button>
            <button
              onClick={() => setCurrentPage('employees')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                currentPage === 'employees'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Сотрудники и подразделения
            </button>
            <button
              onClick={() => setCurrentPage('payments')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                currentPage === 'payments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ведомость выплат
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-full mx-auto px-4 pb-6">
        {currentPage === 'timesheet' && <TimesheetTable />}
        {currentPage === 'employees' && <EmployeesPage />}
        {currentPage === 'payments' && <PaymentsPage />}
      </main>
    </div>
  );
};

export default App;
