import React, { useState, useEffect } from 'react';
import './styles/ItemCard.css';
import ACNHAPI from '../api';
import { useUser } from '../contexts/UserContext';

const ItemCard = ({ item }) => {
  const { currentUser } = useUser();
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    // Fetch collection status when the component mounts
    const fetchCollectionStatus = async () => {
      if (currentUser) {
        try {
          const collections = await ACNHAPI.getUserCollections(currentUser.username);
          const isCollected = collections.collections.some(
            (collectedItem) =>
              collectedItem.itemname === item.itemname &&
              collectedItem.itemtype === item.itemtype
          );
          setCollected(isCollected);
        } catch (error) {
          console.error('Error fetching collection status:', error);
        }
      }
    };

    fetchCollectionStatus();
  }, [currentUser, item.itemname, item.itemtype]);



























  const toggleCollected = async () => {
    if (currentUser) {
        try {
            let response;
            if (collected) {
                response = await ACNHAPI.removeItemFromCollection(currentUser.username, item.itemname, item.itemtype);
            } else {
                response = await ACNHAPI.addItemToCollection(currentUser.username, item.itemname, item.itemtype);
            }
            console.log(`Response from server: ${JSON.stringify(response)}`);
            setCollected(response.action === 'added');
        } catch (error) {
            console.error('Error toggling collection status:', error);
            if (error.response) {
                console.error(`Error response data: ${JSON.stringify(error.response.data)}`); // Log detailed error response
                console.error(`Error response status: ${error.response.status}`); // Log status code
                console.error(`Error response headers: ${JSON.stringify(error.response.headers)}`); // Log headers
            } else {
                console.error('Error details:', error.message);
            }
        }
    }
};































  const renderAvailability = () => {
    if (['Fish', 'Bug', 'Deep Sea Creature'].includes(item.itemtype)) {
      const formatAvailability = (availability) => {
        return availability.map(period => `${period.months}: ${period.time}`).join(', ');
      };

      return (
        <>
          <p>Location: {item.location}</p>
          <p>Months Available (North): {formatAvailability(item.monthsavailablenorth)}</p>
          <p>Months Available (South): {formatAvailability(item.monthsavailablesouth)}</p>
        </>
      );
    }
    return null;
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150'; // Use a placeholder image URL
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="card">
      <img src={item.imageUrl} alt={item.itemname} onError={handleImageError} />
      <h3>{capitalizeWords(item.itemname)}</h3>
      {renderAvailability()}
      <label>
        <input type="checkbox" checked={collected} onChange={toggleCollected} />
        Collected
      </label>
    </div>
  );
};

export default ItemCard;