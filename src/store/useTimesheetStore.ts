import { create } from 'zustand';
import { Employee, TimesheetEntry, AttendanceType, Department, Payment } from '../types';

interface TimesheetStore {
  employees: Employee[];
  departments: Department[];
  entries: Record<string, TimesheetEntry>;
  payments: Payment[];
  selectedYear: number;
  selectedMonth: number;
  searchQuery: string;
  departmentFilter: string;
  
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (dept: string) => void;
  updateEntry: (employeeId: string, date: string, hours: number, type: AttendanceType) => void;
  
  // Department management
  addDepartment: (name: string, parentDepartmentId?: string) => void;
  deleteDepartment: (id: string) => void;
  getDepartments: () => Department[];
  
  // Employee management
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Payment management
  recordPayment: (payment: Omit<Payment, 'id'>) => void;
  getPaymentsForMonth: (year: number, month: number) => Payment[];
}

const mockDepartments: Department[] = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'HR' },
  { id: '3', name: 'Sales' },
  { id: '4', name: 'Frontend', parentDepartmentId: '1' },
  { id: '5', name: 'Backend', parentDepartmentId: '1' },
];

const mockEmployees: Employee[] = [
  { id: '1', fullName: 'Иванов Иван Иванович', age: 32, departmentId: '1', hourlyRate: 500, hireDate: '2020-01-15' },
  { id: '2', fullName: 'Петров Петр Петрович', age: 28, departmentId: '4', hourlyRate: 450, hireDate: '2021-03-20' },
  { id: '3', fullName: 'Сидорова Анна Сергеевна', age: 35, departmentId: '2', hourlyRate: 400, hireDate: '2019-06-10' },
  { id: '4', fullName: 'Козлов Дмитрий Михайлович', age: 41, departmentId: '3', hourlyRate: 380, hireDate: '2018-11-05' },
  { id: '5', fullName: 'Новикова Елена Владимировна', age: 29, departmentId: '2', hourlyRate: 420, hireDate: '2022-02-28' },
  { id: '6', fullName: 'Морозов Алексей Андреевич', age: 37, departmentId: '3', hourlyRate: 390, hireDate: '2020-08-12' },
];

export const useTimesheetStore = create<TimesheetStore>((set, get) => ({
  employees: mockEmployees,
  departments: mockDepartments,
  entries: {},
  payments: [],
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
  
  // Department management
  addDepartment: (name, parentDepartmentId) => {
    const newId = String(Date.now());
    set((state) => ({
      departments: [...state.departments, { id: newId, name, parentDepartmentId }],
    }));
  },
  
  deleteDepartment: (id) => {
    set((state) => ({
      departments: state.departments.filter(d => d.id !== id),
      employees: state.employees.map(e => e.departmentId === id ? { ...e, departmentId: '' } : e),
    }));
  },
  
  getDepartments: () => get().departments,
  
  // Employee management
  addEmployee: (employee) => {
    const newId = String(Date.now());
    set((state) => ({
      employees: [...state.employees, { ...employee, id: newId }],
    }));
  },
  
  updateEmployee: (id, updates) => {
    set((state) => ({
      employees: state.employees.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  },
  
  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter(e => e.id !== id),
    }));
  },
  
  // Payment management
  recordPayment: (payment) => {
    const newId = String(Date.now());
    set((state) => ({
      payments: [...state.payments, { ...payment, id: newId }],
    }));
  },
  
  getPaymentsForMonth: (year, month) => {
    return get().payments.filter(p => p.year === year && p.month === month);
  },
}));
