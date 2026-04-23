export interface Employee {
  id: string;
  fullName: string;
  department: string;
  hourlyRate: number;
}

export type AttendanceType = 'Я' | 'Б' | 'О' | 'К' | 'Н' | '';

export interface TimesheetEntry {
  employeeId: string;
  date: string;
  hours: number;
  type: AttendanceType;
}

export interface TimesheetState {
  employees: Employee[];
  entries: Record<string, TimesheetEntry>;
  selectedYear: number;
  selectedMonth: number;
  searchQuery: string;
  departmentFilter: string;
}
