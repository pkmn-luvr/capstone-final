import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  const key = 'testKey';
  
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value if no value is stored', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should store and retrieve a value', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem(key)).toBe('newValue');
  });

  it('should remove a value when null is passed', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));

    act(() => {
      result.current[1]('newValue');
    });

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should handle function update correctly', () => {
    const { result } = renderHook(() => useLocalStorage(key, 1));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem(key)).toBe('2');
  });

  it('should handle non-JSON string values', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));

    act(() => {
      result.current[1]('simpleString');
    });

    expect(result.current[0]).toBe('simpleString');
    expect(localStorage.getItem(key)).toBe('simpleString');
  });
});
