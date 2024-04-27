export const formatNumber = (number: number) => Math.round(number).toLocaleString();

export const formatDate = (date: Date) => {
  const offsetDate = new Date(date);
  offsetDate.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return offsetDate.toISOString().split("T")[0];
};
