export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  ASSETS: {
    ALL: '/assets',
    MINE: '/assets/mine',
    UPLOAD: '/assets/upload-url',
  },
} as const;
