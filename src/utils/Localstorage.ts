export const loadState = <T>(key: string): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as T;
  } catch (err) {
    console.error(`Error loading state from key "${key}":`, err);
    return undefined;
  }
};

export const saveState = (key: string, value: unknown): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error(`Error saving state to key "${key}":`, err);
  }
};

export const removeState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing state from key "${key}":`, err);
  }
};

export const removeAllState = (): void => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
};
