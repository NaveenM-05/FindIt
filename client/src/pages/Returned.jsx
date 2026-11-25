import { useEffect, useState } from 'react';
import { getItems } from '../api.js';
import ItemCard from '../components/ItemCard.jsx';

export default function Returned() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getItems({ status: 'resolved' }).then(setItems).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h1 className="page-title">Returned to owners</h1>
      <p className="muted">Reports that were closed after the item reached its owner.</p>
      {error && <p className="alert">{error}</p>}
      {items && items.length === 0 && <p className="muted">Nothing has been returned yet.</p>}
      <div className="grid">{(items || []).map((item) => <ItemCard key={item._id} item={item} />)}</div>
    </>
  );
}
