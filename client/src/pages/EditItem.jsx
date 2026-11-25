import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { getItem, getMeta, updateItem } from '../api.js';
import ItemForm from '../components/ItemForm.jsx';
import { useToast } from '../App.jsx';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMeta(), getItem(id)])
      .then(([meta, item]) => setData({ meta, item }))
      .catch((e) => setError(e.message));
  }, [id]);

  const onSubmit = async (form) => {
    try {
      await updateItem(id, form);
      toast('Changes saved');
      navigate(`/items/${id}`);
    } catch (e) { toast(e.message, 'error'); }
  };

  if (error) return <p className="alert">{error}</p>;
  return (
    <>
      <Link to={`/items/${id}`} className="back"><FiArrowLeft /> Back to item</Link>
      <h1 className="page-title">Edit report</h1>
      {data ? <ItemForm meta={data.meta} initial={data.item} onSubmit={onSubmit} submitLabel="Save changes" /> : <p className="muted">Loading…</p>}
    </>
  );
}
