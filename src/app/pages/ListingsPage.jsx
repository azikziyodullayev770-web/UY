import React, { useEffect, useState } from 'react';
import { listingService } from '../services/apiIntegration';
import ListingForm from '../components/ListingForm';
import { useNavigate } from 'react-router';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await listingService.getAll();
      setListings(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = localStorage.getItem('user');

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">House Listings</h1>
        <div>
          {user ? (
            <div className="flex gap-4 items-center">
              <span>Welcome, {JSON.parse(user).name}</span>
              <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded">
                {showForm ? 'Cancel' : 'Add Listing'}
              </button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">
              Login to Add Listing
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="mb-8 border p-4 rounded bg-gray-50">
          <h2 className="text-xl mb-4 font-semibold">Create New Listing</h2>
          <ListingForm onSuccess={() => {
            setShowForm(false);
            fetchListings();
          }} />
        </div>
      )}

      {loading ? (
        <p>Loading listings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.length === 0 && <p>No listings found.</p>}
          {listings.map((listing) => (
            <div key={listing._id} className="border p-4 rounded shadow bg-white">
              {listing.images && listing.images.length > 0 && (
                <img 
                  src={`http://localhost:5000${listing.images[0]}`} 
                  alt={listing.title} 
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h3 className="text-xl font-bold">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.location}</p>
              <p className="text-lg font-bold text-green-600">${listing.price}</p>
              <p className="mt-2 text-gray-800">{listing.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
