import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import ItemImage from './ItemImage.jsx';

export const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item._id}`} className={`card item-card ${item.status}`}>
      <div className="img-wrap">
        <ItemImage item={item} />
        <span className={`badge ${item.type}`}>{item.type === 'lost' ? 'Lost' : 'Found'}</span>
        {item.status === 'resolved' && <span className="badge returned">Returned</span>}
      </div>
      <div className="card-body">
        <span className="cat">{item.category}</span>
        <h3>{item.title}</h3>
        <div className="meta">
          <span><FiMapPin /> {item.location}</span>
          <span><FiCalendar /> {formatDate(item.date)}</span>
        </div>
      </div>
    </Link>
  );
}
