import { Service, MonthlyReport } from '../types';
import { getMonthName } from './dateUtils';

export const generateMonthlyReport = (services: Service[], month: number, year: number): MonthlyReport => {
  const monthServices = services.filter(service => {
    const serviceDate = new Date(service.date);
    return serviceDate.getMonth() === month && serviceDate.getFullYear() === year;
  });

  const totalServices = monthServices.length;
  const totalMenAttendance = monthServices.reduce((sum, service) => sum + service.menAttendance, 0);
  const totalWomenAttendance = monthServices.reduce((sum, service) => sum + service.womenAttendance, 0);
  const totalChildrenAttendance = monthServices.reduce((sum, service) => sum + service.childrenAttendance, 0);
  const totalAttendance = totalMenAttendance + totalWomenAttendance + totalChildrenAttendance;
  const totalTithes = monthServices.reduce((sum, service) => sum + service.tithes, 0);
  const totalOfferings = monthServices.reduce((sum, service) => sum + service.offerings, 0);
  const averageAttendance = totalServices > 0 ? Math.round(totalAttendance / totalServices) : 0;

  return {
    month: getMonthName(month),
    year,
    services: monthServices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    totalServices,
    totalAttendance,
    averageAttendance,
    totalMenAttendance,
    totalWomenAttendance,
    totalChildrenAttendance,
    totalTithes,
    totalOfferings,
    totalIncome: totalTithes + totalOfferings
  };
};