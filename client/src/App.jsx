import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import ReportItem from './pages/ReportItem.jsx';
import EditItem from './pages/EditItem.jsx';
import Returned from './pages/Returned.jsx';
import NotFound from './pages/NotFound.jsx';

// small toast notification shared by all pages
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('findit-theme') || 'light');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('findit-theme', theme);
  }, [theme]);

  const showToast = useCallback((message, kind = 'success') => {
    setToast({ message, kind, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/returned" element={<Returned />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {toast && <div key={toast.id} className={`toast ${toast.kind}`} role="status">{toast.message}</div>}
    </ToastContext.Provider>
  );
}
