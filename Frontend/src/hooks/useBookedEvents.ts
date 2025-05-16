import { useState, useEffect, useCallback } from "react";

export function useBookedEvents() {
  const [bookedEventIds, setBookedEventIds] = useState<Set<string>>(new Set());

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bookedEventIds");
      if (stored) {
        setBookedEventIds(new Set(JSON.parse(stored)));
      }
    } catch (err) {
      console.error("Failed to load bookedEventIds:", err);
    }
  }, []);

  // Persist whenever the set changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "bookedEventIds",
        JSON.stringify(Array.from(bookedEventIds))
      );
    } catch (err) {
      console.error("Failed to save bookedEventIds:", err);
    }
  }, [bookedEventIds]);

  const addBookedEvent = useCallback((eventId: string) => {
    setBookedEventIds((prev) => {
      const next = new Set(prev);
      next.add(eventId);
      return next;
    });
  }, []);

  const removeBookedEvent = useCallback((eventId: string) => {
    setBookedEventIds((prev) => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
  }, []);

  const isEventBooked = useCallback(
    (eventId: string) => {
      return bookedEventIds.has(eventId);
    },
    [bookedEventIds]
  );

  // If you want to inspect the contents easily in JSX, expose an array
  const bookedEventArray = Array.from(bookedEventIds);

  return {
    bookedEventIds, // the Set itself
    bookedEventArray, // an array version for rendering
    addBookedEvent,
    removeBookedEvent,
    isEventBooked,
    count: bookedEventIds.size,
  };
}
