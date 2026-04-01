


// Fix missing properties and incorrect import
const INITIAL_USER = {
  id: 'user_1',
  username: 'Alex Rivera',
  email: 'alex@echo.time',
  isAuthenticated: false,
  isVerified: false,
  avatar: 'https://picsum.photos/200',
  bio: 'Passionate UI designer and developer looking to help others with tech while learning more about marketing.',
  skills: ['UI Design', 'React', 'TypeScript'],
  timeBalance: 12.5,
  ratingAvg: 4.8,
  reviewsCount: 15,
  badges: [
  { id: 'b1', title: 'First Help', description: 'Help 1 user to unlock', condition: 'help_1_user', icon: '🤝', unlocked: true },
  { id: 'b2', title: 'Time Lord', description: 'Accumulate 20 hours of help', condition: 'help_20_hours', icon: '⏱', unlocked: false },
  { id: 'b3', title: 'Top Rated', description: 'Maintain 4.5+ rating for 10 reviews', condition: 'rating_4.5', icon: '⭐', unlocked: true }],

  certificates: [
  { id: 'c1', title: 'Platform Pioneer', description: 'Founding member of Echo Time', unlocked: true },
  { id: 'c2', title: 'Expert Communicator', description: 'Complete 5 collaborative tasks', unlocked: false }],

  freelanceUnlocked: false,
  createdAt: new Date().toISOString()
};

const MOCK_REQUESTS = [
{
  id: 'req_1',
  title: 'Need help with Excel formulas',
  description: 'Looking for someone to help me automate a budget spreadsheet.',
  skillNeeded: 'Excel',
  timeRequired: 2,
  location: 'online',
  status: 'open',
  requesterId: 'user_2',
  createdAt: new Date().toISOString()
},
{
  id: 'req_2',
  title: 'Language Exchange: Arabic for Spanish',
  description: 'I can teach Spanish in exchange for learning basic Arabic.',
  skillNeeded: 'Arabic',
  timeRequired: 1,
  location: 'online',
  status: 'open',
  requesterId: 'user_3',
  createdAt: new Date().toISOString()
}];


export const getStoredUser = () => {
  const saved = localStorage.getItem('echo_user');
  return saved ? JSON.parse(saved) : INITIAL_USER;
};

export const saveUser = (user) => {
  localStorage.setItem('echo_user', JSON.stringify(user));
};

export const getStoredRequests = () => {
  const saved = localStorage.getItem('echo_requests');
  return saved ? JSON.parse(saved) : MOCK_REQUESTS;
};

export const saveRequests = (requests) => {
  localStorage.setItem('echo_requests', JSON.stringify(requests));
};