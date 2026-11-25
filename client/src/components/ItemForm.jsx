import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import ItemImage from './ItemImage.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { type: 'lost', title: '', description: '', category: '', location: '', date: today(), contactName: '', contactEmail: '', contactPhone: '', image: '' };

// resize an uploaded photo in the browser (max 900px wide) so the request stays small
function resizeImage(file, maxWidth = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('That file is not a valid image'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// browser-side checks (the server checks again with Mongoose validators)
function validate(f) {
  const e = {};
  if (f.title.trim().length < 3) e.title = 'Item name must be at least 3 characters';
  if (!f.category) e.category = 'Choose a category';
  if (!f.location) e.location = 'Choose where it was lost/found';
  if (!f.date) e.date = 'Choose a date';
  else if (f.date > today()) e.date = 'Date cannot be in the future';
  if (!f.contactName.trim()) e.contactName = 'Your name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contactEmail)) e.contactEmail = 'Enter a valid email';
  if (f.contactPhone && !/^\d{10}$/.test(f.contactPhone)) e.contactPhone = 'Phone number must be 10 digits';
  return e;
}

export default function ItemForm({ initial, meta, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...initial, date: (initial?.date || today()).slice(0, 10) }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined }); // clear the message once the user edits the field
  };

  const onPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { setForm({ ...form, image: await resizeImage(file) }); setErrors({ ...errors, image: undefined }); }
    catch (err) { setErrors({ ...errors, image: err.message }); }
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true); // stops double clicks from creating two items
    try { await onSubmit(form); } finally { setSaving(false); }
  };

  const field = (key, label, input) => (
    <label className={`field ${errors[key] ? 'has-error' : ''}`}>
      <span>{label}</span>
      {input}
      {errors[key] && <small className="error">{errors[key]}</small>}
    </label>
  );

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <div className="type-toggle">
        {['lost', 'found'].map((t) => (
          <button type="button" key={t} className={`${t} ${form.type === t ? 'active' : ''}`} onClick={() => setForm({ ...form, type: t })}>
            I {t} something
          </button>
        ))}
      </div>

      <div className="form-grid">
        <div className="photo-box">
          <ItemImage item={{ ...form, category: form.category || 'Other' }} />
          <div className="photo-actions">
            <label className="btn btn-ghost"><FiUpload /> Upload photo<input type="file" accept="image/*" hidden onChange={onPhoto} /></label>
            {form.image && <button type="button" className="btn btn-ghost" onClick={() => setForm({ ...form, image: '' })}><FiX /> Remove</button>}
          </div>
          {errors.image && <small className="error">{errors.image}</small>}
          <input className="url-input" placeholder="…or paste an image URL" value={form.image.startsWith('data:') ? '' : form.image} onChange={set('image')} />
        </div>

        <div className="fields">
          {field('title', 'Item name *', <input value={form.title} onChange={set('title')} placeholder="e.g. Black JBL earphones" maxLength={80} />)}
          <div className="row">
            {field('category', 'Category *', (
              <select value={form.category} onChange={set('category')}>
                <option value="">Select…</option>
                {meta.categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            ))}
            {field('location', 'Location *', (
              <select value={form.location} onChange={set('location')}>
                <option value="">Select…</option>
                {meta.locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            ))}
            {field('date', `Date ${form.type} *`, <input type="date" max={today()} value={form.date} onChange={set('date')} />)}
          </div>
          {field('description', 'Description', <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Colour, brand, any marks that help identify it…" maxLength={1000} />)}
          <div className="row">
            {field('contactName', 'Your name *', <input value={form.contactName} onChange={set('contactName')} />)}
            {field('contactEmail', 'Email *', <input type="email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="you@nhce.edu" />)}
            {field('contactPhone', 'Phone (optional)', <input inputMode="numeric" value={form.contactPhone} onChange={set('contactPhone')} placeholder="10 digits" />)}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  );
}
