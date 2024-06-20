import React from 'react';
import { useUser } from '../contexts/UserContext';
import './styles/HomePage.css';

function HomePage() {
  const { currentUser } = useUser();

  return (
    <div className="homepage">
      <header className="header">
        <img src="https://dodo.ac/np/images/thumb/5/52/NH_Logo_English.png/1200px-NH_Logo_English.png" alt="ACNH Logo" className="logo" />
        <h1>Collection & Donation Tracker</h1>
      </header>
      {currentUser && (
        <p className="welcome-message">Welcome back, {currentUser.username}!</p>
      )}
      <section className="features">
        <div className="feature-card">
          <h3>Track Your Collections</h3>
          <p>View and manage all the critters and fossils you have collected!</p>
        </div>
        <div className="feature-card">
          <h3>Monthly Availability</h3>
          <p>Check out which critters are available this month in your hemisphere!</p>
        </div>
        <div className="feature-card">
          <h3>Donation Status</h3>
          <p>Keep track of your museum donations & competion progress!</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
