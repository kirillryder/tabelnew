import { create } from 'zustand';
import { Employee, TimesheetEntry, AttendanceType } from '../types';

interface TimesheetStore {
  employees: Employee[];
  entries: Record<string, TimesheetEntry>;
  selectedYear: number;
  selectedMonth: number;
  searchQuery: string;
  departmentFilter: string;
  
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (dept: string) => void;
  updateEntry: (employeeId: string, date: string, hours: number, type: AttendanceType) => void;
  getDepartments: () => string[];
}

const mockEmployees: Employee[] = [
  { id: '1', fullName: 'Иванов Иван Иванович', department: 'IT', hourlyRate: 500 },
  { id: '2', fullName: 'Петров Петр Петрович', department: 'IT', hourlyRate: 450 },
  { id: '3', fullName: 'Сидорова Анна Сергеевна', department: 'HR', hourlyRate: 400 },
  { id: '4', fullName: 'Козлов Дмитрий Михайлович', department: 'Sales', hourlyRate: 380 },
  { id: '5', fullName: 'Новикова Елена Владимировна', department: 'HR', hourlyRate: 420 },
  { id: '6', fullName: 'Морозов Алексей Андреевич', department: 'Sales', hourlyRate: 390 },
];

export const useTimesheetStore = create<TimesheetStore>((set, get) => ({
  employees: mockEmployees,
  entries: {},
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth(),
  searchQuery: '',
  departmentFilter: '',
  
  setYear: (year) => set({ selectedYear: year }),
  setMonth: (month) => set({ selectedMonth: month }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDepartmentFilter: (dept) => set({ departmentFilter: dept }),
  
  updateEntry: (employeeId, date, hours, type) => {
    const key = `${employeeId}-${date}`;
    set((state) => ({
      entries: {
        ...state.entries,
        [key]: { employeeId, date, hours, type },
      },
    }));
  },
  
  getDepartments: () => {
    const depts = new Set(get().employees.map(e => e.department));
    return Array.from(depts);
  },
}));
