import { useEffect } from "react";

/**
 * Hook that triggers a callback when clicking outside the passed ref
 * @param {React.RefObject} ref - The element to detect outside clicks for
 * @param {Function} callback - Function to call on outside click
 */
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      // Check if click is outside the ref element
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick); // mobile support

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
};

export default useClickOutside;
