export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (!bmi) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateExpProgress = (currentExp, requiredExp) => {
  if (!requiredExp) return 0;
  return Math.min((currentExp / requiredExp) * 100, 100);
};

export const getDaysDifference = (date1, date2 = new Date()) => {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const getWeekDates = (startDate = new Date()) => {
  const dates = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }

  return dates;
};

export const formatExpChange = (change) => {
  if (change > 0) return `+${change}`;
  return change.toString();
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getRankColor = (level) => {
  if (level <= 3) return 'secondary';
  if (level <= 6) return 'primary';
  if (level <= 9) return 'warning';
  return 'danger';
};

export const getStreakMessage = (days) => {
  if (days === 0) return 'Bắt đầu streak của bạn ngay!';
  if (days < 7) return 'Tiếp tục phát huy!';
  if (days < 30) return 'Xuất sắc! Hãy duy trì!';
  return 'Amazing streak! Bạn là nhà vô địch!';
};
