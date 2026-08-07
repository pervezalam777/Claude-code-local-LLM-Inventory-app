/**
 * Formats a date string to a human-readable format without time.
 * Example: "1st Aug, 2016"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const day = date.getDate();
  const daySuffix = getDaySuffix(day);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  // Capitalize the first letter of the month
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day}${daySuffix} ${formattedMonth}, ${year}`;
}

/**
 * Returns the appropriate suffix for a day number.
 */
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
