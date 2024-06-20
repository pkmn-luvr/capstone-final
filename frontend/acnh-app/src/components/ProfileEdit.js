// src/components/ProfileEdit.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { FormInput, FormSelect, FormButton } from './Forms';

const ProfileEdit = () => {
  const { currentUser, updateUser } = useUser();
  const [userData, setUserData] = useState({ username: '', email: '', userhemisphere: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setUserData({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      userhemisphere: currentUser?.userhemisphere || ''
    });
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      await updateUser(userData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile!');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <FormInput label="Username" type="text" name="username" value={userData.username} onChange={handleChange} disabled />
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
        <FormButton label={isUpdating ? 'Updating...' : 'Update Profile'} type="submit" disabled={isUpdating} />
      </form>
    </div>
  );
};

export default ProfileEdit;
