import { useEffect, useState } from 'react';
import { getDashboard, getGroceries, updateGrocery } from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [dashboard, groceries] = await Promise.all([getDashboard(), getGroceries()]);
      setStats(dashboard);
      setItems(groceries);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = async (item) => {
    const itemName = prompt('Item name', item.item_name);
    if (itemName == null) return;

    const quantity = prompt('Quantity', item.quantity);
    if (quantity == null) return;

    const expiryDate = prompt('Expiry date (YYYY-MM-DD)', item.expiry_date || '');
    if (expiryDate == null) return;

    try {
      await updateGrocery(item.id, {
        item_name: itemName,
        quantity: Number(quantity),
        expiry_date: expiryDate || null,
      });
      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

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

      <section className="card">
        <div className="dashboard-header">
          <h3>Product inventory</h3>
          <p className="subtle">All items include purchase date, expiry date, quantity and quick edit access.</p>
        </div>

        <div className="dashboard-table">
          <div className="dashboard-row dashboard-row-head">
            <span>Name</span>
            <span>Quantity</span>
            <span>Purchase</span>
            <span>Expiry</span>
            <span />
          </div>
          {items.map((item) => (
            <div key={item.id} className="dashboard-row">
              <span>{item.item_name}</span>
              <span>{item.quantity}</span>
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
              <span>{item.expiry_date || '—'}</span>
              <button type="button" className="button button-secondary dashboard-edit" onClick={() => handleEdit(item)}>
                <span>Edit</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
