import React, { useEffect, useState } from 'react';

// prefix for local storage
const PREFIX: string = 'whatsapp-clone';

/**
 * useLocalStorage
 * Custom hook extent use state.
 * @param key
 * @param initialvalue
 * @returns
 */

const useLocalStorage = <T>(
  key: string,
  initialvalue: T
): [T, React.Dispatch<any>] => {
  // prefix added to the key.
  const prefixKey = PREFIX + (key ? '-' + key : '');

  const [value, setValue] = useState(() => {
    // check if we can get data from the local storage.
    const jsonValue = localStorage.getItem(prefixKey);

    // CASE 1, if we could get the value from local storage, return the object.
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    // CASE 2. Check the initial value type, if it is a function, call it,
    if (typeof initialvalue === 'function') {
      return initialvalue();
    }
    // CASE 3.else, add the initial value as the initial value.
    else {
      return initialvalue;
    }
  });

  /**
   * update local storage if prefixkey changed or value changed.
   */
  useEffect(() => {
    localStorage.setItem(prefixKey, JSON.stringify(value));
  }, [prefixKey, value]);

  return [value, setValue];
};

export default useLocalStorage;
