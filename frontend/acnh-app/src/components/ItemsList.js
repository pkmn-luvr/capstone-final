import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import ACNHAPI from '../api'; 
import './styles/ItemsList.css';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await ACNHAPI.getAllItems();
        setItems(data);
        setFilteredItems(data); // Initialize filtered items with all items
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (itemType) {
      filtered = filtered.filter(item => item.itemtype === itemType);
    }

    setFilteredItems(filtered);
  };

  return (
    <div>
      <h1>Critter, Fossil, & Artwork Index</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Fish">Fish</option>
          <option value="Bug">Bug</option>
          <option value="Fossil">Fossil</option>
          <option value="Art">Art</option>
          <option value="Deep Sea Creature">Deep Sea Creature</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <div className="item-list">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
