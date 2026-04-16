import { useEffect, useState } from 'react';
import { addShoppingItem, getShoppingList, updateShoppingItem, patchShoppingItem, deleteShoppingItem } from '../api';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setItems(await getShoppingList());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addShoppingItem({ item_name: name, quantity: Number(quantity) });
      setName('');
      setQuantity(1);
      load();
    } catch (e) { setError(e.message); }
  };

  const handleUpdate = async (item) => {
    const newQty = prompt('Quantity', item.quantity);
    if (newQty == null) return;
    try { await updateShoppingItem(item.id, { quantity: Number(newQty) }); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div className="page-shell">
      <section className="section-header">
        <span className="eyebrow">market list</span>
        <h2>Shopping list</h2>
        <p>Curate each purchase with calm clarity and keep your kitchen balanced.</p>
      </section>

      {error && <p className="error">{error}</p>}

      <div className="grid-2">
        <section className="card">
          <h3>Add</h3>
          <form onSubmit={handleAdd} className="form-grid">
            <div className="field-group">
              <label>Item</label>
              <input
                className="input-field"
                placeholder="Item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label>Quantity</label>
              <input
                className="input-field"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button button-primary">Add</button>
          </form>
        </section>

        <section className="card">
          <h3>Items</h3>
          {items.length === 0 ? (
            <p className="subtle">Empty</p>
          ) : (
            <ul className="item-list">
              {items.map((item) => (
                <li key={item.id} className="item-card">
                  <div className="item-title-row">
                    <strong>{item.item_name}</strong>
                    <span className="item-meta">x{item.quantity} {item.purchased ? '· Purchased' : ''}</span>
                  </div>
                  <div className="action-bar">
                    {!item.purchased && (
                      <button type="button" className="button button-secondary" onClick={() => patchShoppingItem(item.id).then(load).catch((e) => setError(e.message))}>
                        <span>Mark Purchased</span>
                      </button>
                    )}
                    <button type="button" className="button button-secondary" onClick={() => handleUpdate(item)}>Edit</button>
                    <button type="button" className="button button-secondary" onClick={() => deleteShoppingItem(item.id).then(load).catch((e) => setError(e.message))}>Delete</button>
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

export default ShoppingList;
