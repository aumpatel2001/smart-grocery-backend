import { useEffect, useState } from 'react';
import { getDashboard } from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setStats(await getDashboard());
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <ul>
        <li>Total grocery items: {stats.totalItems}</li>
        <li>Consumed items: {stats.consumedItems}</li>
        <li>Expired items: {stats.expiredItems}</li>
        <li>Available items: {stats.availableItems}</li>
      </ul>
    </div>
  );
}

export default Dashboard;
