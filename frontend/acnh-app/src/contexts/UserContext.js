import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import useLocalStorage from '../hooks/useLocalStorage';
import ACNHAPI from '../api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage('token', null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          ACNHAPI.setAuthToken(token);
          const decoded = jwtDecode(token);
          setCurrentUser(decoded);
          console.log('Current user set:', decoded);
        } catch (error) {
          console.error('Error decoding token:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/token`, credentials);
      const { token } = response.data;
      setToken(token);
      ACNHAPI.setAuthToken(token);
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
      console.log('Login successful. Token:', token);
      console.log('Current user set:', decoded);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    ACNHAPI.setAuthToken(null);
    setIsLoggingOut(true);
    console.log('User logged out: currentUser and token set to null.');
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, userData);
      const { token } = response.data;
      setToken(token);
      ACNHAPI.setAuthToken(token);
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
      console.log('Signup successful. Token:', token);
      console.log('Current user set:', decoded);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    if (!currentUser || !currentUser.username) {
      alert("You must be logged in to update your profile.");
      return;
    }
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/${currentUser.username}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data.user);
      console.log('User data updated:', response.data.user);
    } catch (error) {
      console.error('Failed to update user data:', error.response ? error.response.data : error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, login, logout, signup, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

