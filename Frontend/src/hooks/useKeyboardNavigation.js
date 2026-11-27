import { useCallback, useState } from "react";

export const useKeyboardNavigation = (items = [], onSelect) => {
  const [cursor, setCursor] = useState(0);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && items.length > 0) {
        e.preventDefault();
        onSelect(items[cursor]);
      }
    },
    [cursor, items, onSelect]
  );

  return {
    cursor,
    setCursor,
    handleKeyDown,
  };
};
