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
  if (!stats) return <p className="loading">Loading...</p>;

  return (
    <div className="page-shell">
      <section className="section-header">
        <span className="eyebrow">pantry pulse</span>
        <h2>Dashboard</h2>
        <p>Read the status of your kitchen at a glance with elegant clarity.</p>
      </section>

      <section className="card stats-grid">
        <ul className="stat-list">
          <li>
            <strong>{stats.totalItems}</strong>
            <span>Total grocery items</span>
          </li>
          <li>
            <strong>{stats.consumedItems}</strong>
            <span>Consumed items</span>
          </li>
          <li>
            <strong>{stats.expiredItems}</strong>
            <span>Expired items</span>
          </li>
          <li>
            <strong>{stats.availableItems}</strong>
            <span>Available items</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
