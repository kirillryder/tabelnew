import React from 'react';
import { Header, TimesheetTable } from './components';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-full mx-auto px-4 py-6">
        <TimesheetTable />
      </main>
    </div>
  );
};

export default App;
