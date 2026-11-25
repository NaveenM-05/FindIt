// Lost/Found tabs, category chips with counts, location and sort selects
export default function Filters({ filters, setFilters, meta, counts }) {
  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const countFor = (c) => counts.find((x) => x.category === c)?.count || 0;

  return (
    <div className="filters">
      <div className="tabs" role="tablist">
        {[['', 'All'], ['lost', 'Lost'], ['found', 'Found']].map(([v, label]) => (
          <button key={label} role="tab" aria-selected={filters.type === v} className={`tab ${filters.type === v ? 'active' : ''}`} onClick={() => set('type', v)}>
            {label}
          </button>
        ))}
      </div>

      <div className="chips">
        <button className={`chip ${filters.category === '' ? 'active' : ''}`} onClick={() => set('category', '')}>All categories</button>
        {meta.categories.map((c) => (
          <button key={c} className={`chip ${filters.category === c ? 'active' : ''}`} onClick={() => set('category', filters.category === c ? '' : c)}>
            {c} <span className="count">{countFor(c)}</span>
          </button>
        ))}
      </div>

      <div className="selects">
        <select value={filters.location} onChange={(e) => set('location', e.target.value)} aria-label="Location">
          <option value="">All locations</option>
          {meta.locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={filters.sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>
  );
}
