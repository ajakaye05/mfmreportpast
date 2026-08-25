export interface Service {
  id: string;
  date: string;
  preacher: string;
  theme: string;
  menAttendance: number;
  womenAttendance: number;
  childrenAttendance: number;
  tithes: number;
  offerings: number;
  createdAt?: string;
}

export interface ChurchInfo {
  name: string;
  address: string;
  logoUrl?: string;
}

export interface MonthlyReport {
  month: string;
  year: number;
  services: Service[];
  totalServices: number;
  totalAttendance: number;
  averageAttendance: number;
  totalTithes: number;
  totalOfferings: number;
  totalIncome: number;
  totalMenAttendance: number;
  totalWomenAttendance: number;
  totalChildrenAttendance: number;
}