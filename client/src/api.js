// All calls to the Express API live here. Errors from the server become JavaScript Errors.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const getMeta = () => request('/meta');
export const getStats = () => request('/items/stats');
export const getItems = (params = {}) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
  return request(`/items?${new URLSearchParams(clean)}`);
};
export const getItem = (id) => request(`/items/${id}`);
export const createItem = (item) => request('/items', { method: 'POST', body: JSON.stringify(item) });
export const updateItem = (id, item) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(item) });
export const toggleResolved = (id) => request(`/items/${id}/resolve`, { method: 'PATCH' });
export const deleteItem = (id) => request(`/items/${id}`, { method: 'DELETE' });
