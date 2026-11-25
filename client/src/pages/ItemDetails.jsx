import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiTag, FiClock, FiUser, FiMail, FiPhone, FiEdit2, FiTrash2, FiCheckCircle, FiRotateCcw } from 'react-icons/fi';
import { deleteItem, getItem, toggleResolved } from '../api.js';
import ItemImage from '../components/ItemImage.jsx';
import { formatDate } from '../components/ItemCard.jsx';
import { useToast } from '../App.jsx';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getItem(id).then(setItem).catch((e) => setError(e.message)); }, [id]);

  const onResolve = async () => {
    try {
      const updated = await toggleResolved(id);
      setItem(updated);
      toast(updated.status === 'resolved' ? 'Marked as returned to the owner' : 'Report reopened');
    } catch (e) { toast(e.message, 'error'); }
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this report permanently?')) return;
    try { await deleteItem(id); toast('Report deleted'); navigate('/'); }
    catch (e) { toast(e.message, 'error'); }
  };

  if (error) return <div className="card empty"><p>{error}</p><Link to="/" className="btn btn-primary">Back to all items</Link></div>;
  if (!item) return <p className="muted">Loading…</p>;

  const resolved = item.status === 'resolved';
  return (
    <>
      <Link to="/" className="back"><FiArrowLeft /> All items</Link>
      <article className="card details">
        <div className="details-img">
          <ItemImage item={item} />
          <span className={`badge ${item.type}`}>{item.type === 'lost' ? 'Lost' : 'Found'}</span>
        </div>
        <div className="details-body">
          {resolved && <p className="resolved-note"><FiCheckCircle /> Returned to the owner on {formatDate(item.resolvedAt)}</p>}
          <h1>{item.title}</h1>
          <p className="desc">{item.description || 'No description given.'}</p>

          <div className="facts">
            <div><FiTag /><span>Category</span><b>{item.category}</b></div>
            <div><FiMapPin /><span>Location</span><b>{item.location}</b></div>
            <div><FiCalendar /><span>Date {item.type}</span><b>{formatDate(item.date)}</b></div>
            <div><FiClock /><span>Reported</span><b>{formatDate(item.createdAt)}</b></div>
          </div>

          <div className="contact">
            <h3>Contact {item.type === 'lost' ? 'the owner' : 'the finder'}</h3>
            <p><FiUser /> {item.contactName}</p>
            <p><FiMail /> <a href={`mailto:${item.contactEmail}?subject=${encodeURIComponent('FindIt: ' + item.title)}`}>{item.contactEmail}</a></p>
            {item.contactPhone && <p><FiPhone /> <a href={`tel:${item.contactPhone}`}>{item.contactPhone}</a></p>}
          </div>

          <div className="actions">
            <button className={`btn ${resolved ? 'btn-ghost' : 'btn-success'}`} onClick={onResolve}>
              {resolved ? <><FiRotateCcw /> Reopen</> : <><FiCheckCircle /> Mark as returned</>}
            </button>
            <Link to={`/items/${id}/edit`} className="btn btn-ghost"><FiEdit2 /> Edit</Link>
            <button className="btn btn-danger" onClick={onDelete}><FiTrash2 /> Delete</button>
          </div>
        </div>
      </article>
    </>
  );
}
