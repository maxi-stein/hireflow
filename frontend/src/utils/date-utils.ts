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

export const getDateHeader = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = dateObj.toDateString() === today.toDateString();
  const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

  const dateString = dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (isToday) return `Today, ${dateString}`;
  if (isTomorrow) return `Tomorrow, ${dateString}`;
  return dateString;
};
