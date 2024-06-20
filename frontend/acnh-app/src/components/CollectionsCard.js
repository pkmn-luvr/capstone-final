import React, { useState } from 'react';
import ACNHAPI from '../api';
import { useUser } from '../contexts/UserContext';

const CollectionsCard = ({ collection }) => {
  const [donated, setDonated] = useState(collection.donated);
  const { currentUser } = useUser();

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150';
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const toggleDonationStatus = async () => {
    try {
      const response = await ACNHAPI.toggleDonationStatus(currentUser.username, collection.itemname, collection.itemtype);
      setDonated(response.donated);
    } catch (err) {
      console.error('Error toggling donation status:', err);
    }
  };

  return (
    <div className="card">
      <img src={collection.image_url} alt={collection.itemname} onError={handleImageError} />
      <h3>{capitalizeWords(collection.itemname)}</h3>
      <p>Item Type: {collection.itemtype}</p>
      <label>
        <input type="checkbox" checked={donated} onChange={toggleDonationStatus} />
        Donated
      </label>
    </div>
  );
};

export default CollectionsCard;
