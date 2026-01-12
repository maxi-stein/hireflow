import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook to handle highlighting an element based on a query parameter.
 * Automatically scrolls to the element and removes the highlight/query param after a duration.
 *
 * @param paramName The name of the query parameter to check (default: 'highlight')
 * @param duration How long to keep the highlight active (default: 2000ms)
 */
export function useHighlightEffect(paramName: string = 'highlight', duration: number = 2000) {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get(paramName);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const elementsRefs = useRef<Record<string, HTMLElement | null>>({});

  const setElementRef = (id: string) => (el: HTMLElement | null) => {
    elementsRefs.current[id] = el;
  };

  useEffect(() => {
    if (highlightId && elementsRefs.current[highlightId]) {
      const element = elementsRefs.current[highlightId];

      // Apply highlight
      setHighlightedId(highlightId);

      // Scroll to the element
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Set timer to clear everything
      const timer = setTimeout(() => {
        setHighlightedId(null);
        setSearchParams(
          (params) => {
            const newParams = new URLSearchParams(params);
            newParams.delete(paramName);
            return newParams;
          },
          { replace: true },
        );
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [highlightId, setSearchParams, paramName, duration]);

  return {
    highlightedId,
    setElementRef,
    isHighlighted: (id: string) => highlightedId === id,
  };
}
