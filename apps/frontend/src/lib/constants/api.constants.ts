export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  ASSETS: {
    ALL: '/assets',
    MINE: '/assets/mine',
  },
} as const;
