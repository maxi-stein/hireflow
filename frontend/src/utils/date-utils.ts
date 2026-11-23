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

/**
 * Parsea una fecha sin hora (YYYY-MM-DD o ISO) como fecha local (sin desfase horario UTC).
 * Evita el desvío de 1 día que ocurre en zonas horarias negativas (ej. UTC-3 Buenos Aires)
 * cuando new Date("YYYY-MM-DD") se evalúa como medianoche UTC.
 */
export const parseLocalDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;

  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return new Date(date);
};

/**
 * Formatea una fecha local respetando el día del calendario sin desfases de huso horario.
 */
export const formatLocalDate = (date: string | Date | null | undefined, locale?: string): string => {
  const parsed = parseLocalDate(date);
  return parsed ? parsed.toLocaleDateString(locale) : '-';
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
    year: 'numeric',
  });

  if (isToday) return `${dateString}`;
  if (isTomorrow) return `${dateString}`;
  return dateString;
};
