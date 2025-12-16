export const getDaysInMonth = (date: Date): (Date | null)[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const daysArray: (Date | null)[] = [];
  // Add empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  // Add days of current month
  for (let i = 1; i <= days; i++) {
    daysArray.push(new Date(year, month, i));
  }
  return daysArray;
};
