import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './styles/Navigation.css';


const Navigation = () => {
  const { currentUser, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/items">Critter, Fossil, & Artwork Index</Link></li>
        <li><Link to="/items/availability">Critter Availability</Link></li>
        {currentUser && (
          <>
            <li><Link to={`/users/${currentUser.username}/collections`}>My Collection</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        )}
        {!currentUser && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
