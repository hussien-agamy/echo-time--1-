

const INITIAL_USER = {
  id: 'guest',
  username: 'Guest',
  isAuthenticated: false,
  isVerified: false,
  timeBalance: 0,
  hasCompletedOnboarding: false,
  badges: [],
  ratingAvg: 0,
  freelanceUnlocked: false
};

export const getToken = () => localStorage.getItem('echo_token');
export const setToken = (token) => localStorage.setItem('echo_token', token);
export const removeToken = () => localStorage.removeItem('echo_token');

export const getStoredUser = () => {
  const saved = localStorage.getItem('echo_user');
  if (saved) return JSON.parse(saved);
  return INITIAL_USER;
};

export const saveUser = (user) => {
  localStorage.setItem('echo_user', JSON.stringify(user));
};

export const getStoredRequests = () => {
  const saved = localStorage.getItem('echo_requests');
  return saved ? JSON.parse(saved) : [];
};

export const saveRequests = (requests) => {
  localStorage.setItem('echo_requests', JSON.stringify(requests));
};