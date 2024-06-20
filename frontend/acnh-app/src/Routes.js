// Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ItemsList from './components/ItemsList';
import CollectionsList from './components/CollectionsList';
import CritterAvailability from './components/CritterAvailability';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfileEdit from './components/ProfileEdit';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/items" element={<ItemsList />} />
        <Route path="/users/:username/collections" element={<CollectionsList />} />
        <Route path="/items/availability" element={<CritterAvailability />} />
        <Route path="/profile" element={<ProfileEdit />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
);

export default AppRoutes;
