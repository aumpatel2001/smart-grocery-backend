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

  useEffect(() => {
    refresh();
  }, []);

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
    <div>
      <h2>Groceries</h2>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <h3>Add Item</h3>
        <form onSubmit={handleAdd}>
          <input
            placeholder="Item name"
            value={item.item_name}
            onChange={(e) => setItem({ ...item, item_name: e.target.value })}
            required
          />
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={item.category}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
          />
          <input
            type="date"
            value={item.expiry_date}
            onChange={(e) => setItem({ ...item, expiry_date: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <h3>Items</h3>
        {items.length === 0 && <p>No groceries yet.</p>}
        <ul>
          {items.map((i) => (
            <li key={i.id}>
              <strong>{i.item_name}</strong> x{i.quantity} | {i.category || 'uncategorized'} | {i.status}
              <br />
              <small>expires: {i.expiry_date || 'n/a'}</small>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => mark(i.id, 'consume')}>Consumed</button>
                <button onClick={() => mark(i.id, 'expire')}>Expire</button>
                <button onClick={() => update(i.id)}>Edit</button>
                <button onClick={() => remove(i.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Groceries;
