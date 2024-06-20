// src/components/CritterCard.js
import React from 'react';

const CritterCard = ({ item }) => {
  return (
    <div className="critter-card">
      <img src={item.image_url} alt={item.itemname} />
      <h3>{item.itemname}</h3>
      <p>Type: {item.itemtype}</p>
      <p>Location: {item.location}</p>
      <p>Rarity: {item.rarity}</p>
      <p>Available Times: {item.timesavailable.join(', ')}</p>
    </div>
  );
};

export default CritterCard;
