export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'XAF'
  }).format(amount);
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getCurrentMonth = (): { month: number; year: number } => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear()
  };
};

export const getMonthsInYear = (year: number): Array<{ month: number; name: string }> => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i,
    name: getMonthName(i)
  }));
};