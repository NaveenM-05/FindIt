import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar">
      <FiSearch />
      <input
        type="text"
        placeholder="Search by item name or description…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search items"
      />
      {value && <button className="icon-btn small" onClick={() => onChange('')} aria-label="Clear search"><FiX /></button>}
    </div>
  );
}
