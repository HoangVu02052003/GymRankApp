export const MAX_DAILY_EXP = 100;

export const STREAK_PENALTY = -50;

export const MAX_INACTIVE_DAYS = 5;

export const EXP_PER_EXERCISE = 100;

export const WORKOUT_TYPES = {
  PUSH: 'push',
  PULL: 'pull',
  LEG: 'leg',
  FULLBODY: 'fullbody',
  CUSTOM: 'custom'
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const GENDER_OPTIONS = {
  NAM: 'Nam',
  NU: 'Nữ',
  KHAC: 'Khác'
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const GOALS = {
  WEIGHT_LOSS: 'weight_loss',
  MUSCLE_GAIN: 'muscle_gain',
  STRENGTH: 'strength',
  ENDURANCE: 'endurance',
  GENERAL: 'general'
};

export const MUSCLE_GROUPS = [
  'Ngực',
  'Lưng',
  'Vai',
  'Vai sau',
  'Tay trước',
  'Tay sau',
  'Chân trước',
  'Chân sau',
  'Mông',
  'Bắp chân',
  'Bụng',
  'Lưng dưới'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    STATS: '/profile/stats'
  },
  WORKOUT: {
    TODAY: '/workout/today',
    COMPLETE: '/workout/complete',
    HISTORY: '/workout/history',
    UPDATE_PROGRESS: '/workout/update-progress'
  },
  SCHEDULE: {
    LIST: '/schedule',
    CREATE: '/schedule',
    DETAIL: '/schedule/:id',
    TODAY: '/schedule/today',
    WEEK: '/schedule/week'
  },
  RANK: {
    LIST: '/rank',
    CURRENT: '/rank/current',
    CHECK_RANKUP: '/rank/check-rankup',
    RANKUP: '/rank/rankup',
    TEST_CREATE: '/rank/test/create',
    TEST_SUBMIT: '/rank/test/submit'
  }
};
