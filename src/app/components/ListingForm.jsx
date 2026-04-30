import React, { useState } from 'react';
import { listingService } from '../services/apiIntegration';

export default function ListingForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('location', location);
      
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      }

      await listingService.create(formData);
      onSuccess(); // refresh list and close form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
      {error && <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input required type="text" className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea required className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input required type="number" className="w-full border p-2 rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input required type="text" className="w-full border p-2 rounded" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Images</label>
        <input type="file" multiple accept="image/*" className="w-full border p-2 rounded" onChange={(e) => setFiles(e.target.files)} />
      </div>

      <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded mt-2 disabled:bg-blue-300">
        {loading ? 'Saving...' : 'Submit Listing'}
      </button>
    </form>
  );
}
