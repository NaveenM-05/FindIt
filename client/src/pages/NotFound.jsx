import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card empty">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link to="/" className="btn btn-primary">Go to FindIt home</Link>
    </div>
  );
}
