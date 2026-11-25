import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { getItems, getMeta, getStats } from '../api.js';
import SearchBar from '../components/SearchBar.jsx';
import Filters from '../components/Filters.jsx';
import ItemCard from '../components/ItemCard.jsx';

export default function Home() {
  const [meta, setMeta] = useState({ categories: [], locations: [] });
  const [stats, setStats] = useState({ lost: 0, found: 0, resolved: 0, byCategory: [] });
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(''); // search text after the debounce delay
  const [filters, setFilters] = useState({ type: '', category: '', location: '', sort: 'newest' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMeta().then(setMeta).catch(() => {});
    getStats().then(setStats).catch(() => {});
  }, []);

  // wait 250 ms after the user stops typing before searching
  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false; // ignore responses that arrive after a newer request
    setLoading(true);
    getItems({ q: query, ...filters })
      .then((data) => { if (!cancelled) { setItems(data); setError(''); } })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [query, filters]);

  return (
    <>
      <section className="hero">
        <div>
          <h1>Lost something on campus?</h1>
          <p>Browse items reported by students and staff, or report what you lost or found in under a minute.</p>
          <Link to="/report" className="btn btn-light"><FiPlus /> Report an item</Link>
        </div>
        <div className="hero-stats">
          <div><b>{stats.lost}</b><span>Still lost</span></div>
          <div><b>{stats.found}</b><span>Waiting to be claimed</span></div>
          <div><b>{stats.resolved}</b><span>Returned to owners</span></div>
        </div>
      </section>

      <SearchBar value={search} onChange={setSearch} />
      <Filters filters={filters} setFilters={setFilters} meta={meta} counts={stats.byCategory} />

      <div className="list-head">
        <h2>{filters.type === 'lost' ? 'Lost items' : filters.type === 'found' ? 'Found items' : 'All open reports'}</h2>
        <span className="muted">{loading ? 'Loading…' : `${items.length} item${items.length === 1 ? '' : 's'}`}</span>
      </div>

      {error && <p className="alert">Could not load items: {error}</p>}
      {!loading && !error && items.length === 0 && (
        <div className="empty card"><p>No items match your search.</p><Link to="/report" className="btn btn-primary">Report an item</Link></div>
      )}
      <div className="grid">{items.map((item) => <ItemCard key={item._id} item={item} />)}</div>
    </>
  );
}
