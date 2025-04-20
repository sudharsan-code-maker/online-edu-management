import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const UserCountProgressBar = () => {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get_user_count/');
        if (!response.ok) {
          throw new Error('Failed to fetch user count');
        }
        const data = await response.json();
        setUserCount(data.user_count);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user count:', error);
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-bold mb-4">User Count</div>
      <div className="relative w-32 h-32">
        <CircularProgress
          variant="determinate"
          value={userCount}
          size={200}
          thickness={1}
          color="primary"
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="text-4xl font-bold">{userCount}</div>
        </div>
      </div>
      <LinearProgress
        variant="determinate"
        value={userCount}
        className="mt-4 w-64"
        color="primary"
      />
    </div>
  );
};

export default UserCountProgressBar;
