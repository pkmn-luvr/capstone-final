import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { UserProvider, useUser } from './UserContext';
import useLocalStorage from '../hooks/useLocalStorage';

jest.mock('axios');
jest.mock('jwt-decode');
jest.mock('../hooks/useLocalStorage');

describe('UserContext', () => {
  const mockUser = { username: 'testuser' };
  const mockToken = 'mockToken';
  const setItemMock = jest.fn();

  beforeEach(() => {
    jwtDecode.mockReturnValue(mockUser);
    useLocalStorage.mockImplementation(() => [mockToken, setItemMock]);
  });

  const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;

  it('should login a user and set current user', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: mockToken } });
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      await result.current.login({ username: 'test', password: 'test' });
    });

    expect(result.current.currentUser).toEqual(mockUser);
    expect(setItemMock).toHaveBeenCalledWith(mockToken);
  });

  it('should logout a user and clear current user', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: mockToken } });
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      await result.current.login({ username: 'test', password: 'test' });
      result.current.logout();
    });

    expect(result.current.currentUser).toBeNull();
    expect(setItemMock).toHaveBeenCalledWith(null);
  });

  it('should signup a user and set current user', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: mockToken } });
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      await result.current.signup({ username: 'test', password: 'test', email: 'test@test.com' });
    });

    expect(result.current.currentUser).toEqual(mockUser);
    expect(setItemMock).toHaveBeenCalledWith(mockToken);
  });
});
