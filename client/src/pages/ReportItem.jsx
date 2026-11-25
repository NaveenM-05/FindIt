import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem, getMeta } from '../api.js';
import ItemForm from '../components/ItemForm.jsx';
import { useToast } from '../App.jsx';

export default function ReportItem() {
  const navigate = useNavigate();
  const toast = useToast();
  const [meta, setMeta] = useState(null);

  useEffect(() => { getMeta().then(setMeta).catch((e) => toast(e.message, 'error')); }, [toast]);

  const onSubmit = async (form) => {
    try {
      const item = await createItem(form);
      toast('Report saved');
      navigate(`/items/${item._id}`);
    } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <h1 className="page-title">Report a lost or found item</h1>
      {meta ? <ItemForm meta={meta} onSubmit={onSubmit} submitLabel="Submit report" /> : <p className="muted">Loading…</p>}
    </>
  );
}
