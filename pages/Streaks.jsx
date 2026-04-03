import React from 'react';
import { StreakDashboard } from '../components/StreakSystem';

const Streaks = ({ user, setUser }) => {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <StreakDashboard user={user} setUser={setUser} />
    </div>
  );
};

export default Streaks;
