import { useEffect, useState } from "react";

const useDebounce = (value, delay = 500, immediateSearch = false) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (immediateSearch) {
        setDebounced(value);
      } else {
        ![1, 2].includes(value.length) && setDebounced(value);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
