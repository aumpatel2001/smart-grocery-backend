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
    <div>
      <h2>Shopping List</h2>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <h3>Add</h3>
        <form onSubmit={handleAdd}>
          <input placeholder="Item" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <h3>Items</h3>
        {items.length === 0 && <p>Empty</p>}
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.item_name} x{item.quantity} {item.purchased ? '(purchased)' : ''}</span>
              <div style={{ marginTop: 6 }}>
                {!item.purchased && <button onClick={() => patchShoppingItem(item.id)}>Mark Purchased</button>}
                <button onClick={() => handleUpdate(item)}>Edit</button>
                <button onClick={() => deleteShoppingItem(item.id).then(load).catch((e) => setError(e.message))}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ShoppingList;
