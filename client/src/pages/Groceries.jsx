import { useEffect, useState } from 'react';
import { addGrocery, getGroceries, updateGrocery, patchGrocery, deleteGrocery } from '../api';

const initial = { item_name: '', quantity: 1, category: '', expiry_date: '' };

function Groceries() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(initial);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      const data = await getGroceries();
      setItems(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addGrocery({
        item_name: item.item_name,
        quantity: Number(item.quantity),
        category: item.category || null,
        expiry_date: item.expiry_date || null,
      });
      setItem(initial);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  const mark = async (id, action) => {
    try {
      await patchGrocery(id, action);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    try {
      await deleteGrocery(id);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  const update = async (id) => {
    try {
      const name = prompt('New name (leave blank to keep)', '');
      if (!name) return;
      await updateGrocery(id, { item_name: name });
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="page-shell">
      <section className="section-header">
        <span className="eyebrow">Pantry edit</span>
        <h2>Groceries</h2>
        <p>Maintain a quiet, elevated inventory with clear status and gentle ritual.</p>
      </section>

      {error && <p className="error">{error}</p>}

      <div className="grid-2">
        <section className="card">
          <h3>Add item</h3>
          <form onSubmit={handleAdd} className="form-grid">
            <div className="field-group">
              <label>Item name</label>
              <input
                className="input-field"
                placeholder="Item name"
                value={item.item_name}
                onChange={(e) => setItem({ ...item, item_name: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Quantity</label>
              <input
                className="input-field"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => setItem({ ...item, quantity: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label>Category</label>
              <input
                className="input-field"
                placeholder="Category"
                value={item.category}
                onChange={(e) => setItem({ ...item, category: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Expiry date</label>
              <input
                className="input-field"
                type="date"
                value={item.expiry_date}
                onChange={(e) => setItem({ ...item, expiry_date: e.target.value })}
              />
            </div>
            <button type="submit" className="button button-primary">Add</button>
          </form>
        </section>

        <section className="card">
          <h3>Items</h3>
          {items.length === 0 ? (
            <p className="subtle">No groceries yet.</p>
          ) : (
            <ul className="item-list">
              {items.map((i) => (
                <li key={i.id} className="item-card">
                  <div className="item-title-row">
                    <strong>{i.item_name}</strong>
                    <span className="item-meta">{i.category || 'Uncategorized'} · {i.status}</span>
                  </div>
                  <p className="item-info">Quantity: {i.quantity}</p>
                  <small>Expires: {i.expiry_date || 'n/a'}</small>
                  <div className="action-bar">
                    <button type="button" className="button button-secondary" onClick={() => mark(i.id, 'consume')}>Consumed</button>
                    <button type="button" className="button button-secondary" onClick={() => mark(i.id, 'expire')}>Expire</button>
                    <button type="button" className="button button-secondary" onClick={() => update(i.id)}>Edit</button>
                    <button type="button" className="button button-secondary" onClick={() => remove(i.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Groceries;
