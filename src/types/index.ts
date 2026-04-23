export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  age: number;
  departmentId: string;
  hourlyRate: number;
  hireDate: string;
}

export type AttendanceType = 'Я' | 'Б' | 'О' | 'К' | 'Н' | '';

export interface TimesheetEntry {
  employeeId: string;
  date: string;
  hours: number;
  type: AttendanceType;
}

export interface Payment {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  paymentMethod: 'transfer' | 'cash';
  paymentDate?: string;
}

export interface TimesheetState {
  employees: Employee[];
  departments: Department[];
  entries: Record<string, TimesheetEntry>;
  payments: Payment[];
  selectedYear: number;
  selectedMonth: number;
  searchQuery: string;
  departmentFilter: string;
}
