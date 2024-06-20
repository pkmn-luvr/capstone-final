import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import ItemCard from './ItemCard';
import './styles/CritterAvailability.css';


const CritterAvailability = () => {
  const { currentUser } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the current month abbreviation
  const getCurrentMonthAbbreviation = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    return monthNames[now.getMonth()];
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!currentUser) {
        console.log('No current user found.');
        return;
      }
      console.log('Current user:', currentUser);  // Log the current user object
      
      const hemisphere = currentUser.userhemisphere;
      console.log('User hemisphere:', hemisphere);  // Log the user's hemisphere
      
      if (!hemisphere) {
        console.error('Hemisphere is undefined for the current user.');
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const month = getCurrentMonthAbbreviation(); // Get the month abbreviation
        console.log(`Fetching availability for month: ${month} and hemisphere: ${hemisphere}`);
        
        const response = await axios.get('http://localhost:3001/items/availability', {
          params: { month, hemisphere }
        });
        console.log('Response data:', response.data);
        const formattedData = response.data.map(item => ({
          ...item,
          imageUrl: item.image_url  // Ensure the property is correctly named
        }));
        setItems(formattedData);
      } catch (err) {
        console.error('Error fetching critter availability:', err);
        setError('Failed to fetch critter availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [currentUser]);

  if (loading) {
    console.log('Loading data...');
    return <p>Loading...</p>;
  }

  if (error) {
    console.log('Error occurred:', error);
    return <p>{error}</p>;
  }

  console.log('Items:', items);

  return (
    <div>
      <h1>Critters Available This Month</h1>
      <div className="item-list">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CritterAvailability;
