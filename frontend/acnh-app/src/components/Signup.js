// src/components/Signup.js
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect, FormButton } from './Forms';

const Signup = () => {
  const [userData, setUserData] = useState({ username: '', password: '', email: '', userhemisphere: '' });
  const { signup } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <FormInput label="Username" type="text" name="username" value={userData.username} onChange={handleChange} required />
        <FormInput label="Password" type="password" name="password" value={userData.password} onChange={handleChange} required />
        <FormInput label="Email" type="email" name="email" value={userData.email} onChange={handleChange} required />
        <FormSelect 
          label="User Hemisphere" 
          name="userhemisphere" 
          value={userData.userhemisphere} 
          onChange={handleChange} 
          options={[
            { value: 'north', label: 'North' },
            { value: 'south', label: 'South' }
          ]}
          required
        />
        <FormButton label="Signup" type="submit" />
      </form>
    </div>
  );
};

export default Signup;
