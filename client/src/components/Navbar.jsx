import { Link, NavLink } from 'react-router-dom';
import { FiMoon, FiSun, FiPlus, FiSearch } from 'react-icons/fi';

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon"><FiSearch /></span>
          <span>FindIt<small>Campus Lost &amp; Found</small></span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/returned">Returned</NavLink>
          <Link to="/report" className="btn btn-primary"><FiPlus /> Report item</Link>
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle dark mode" title="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </nav>
      </div>
    </header>
  );
}
