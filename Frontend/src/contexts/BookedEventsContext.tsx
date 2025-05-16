import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type BookedEventsContextType = {
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  size: number;
};

const BookedEventsContext = createContext<BookedEventsContextType | undefined>(
  undefined
);

export const BookedEventsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [ids, setIds] = useState<Set<string>>(new Set());

  // Load once from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bookedEventIds");
      if (raw) setIds(new Set(JSON.parse(raw)));
    } catch (e) {
      console.error("Failed to load bookedEventIds:", e);
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem("bookedEventIds", JSON.stringify(Array.from(ids)));
    } catch (e) {
      console.error("Failed to save bookedEventIds:", e);
    }
  }, [ids]);

  const has = useCallback((id: string) => ids.has(id), [ids]);
  const add = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);
  const remove = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <BookedEventsContext.Provider value={{ has, add, remove, size: ids.size }}>
      {children}
    </BookedEventsContext.Provider>
  );
};

export function useBookedEvents1() {
  const ctx = useContext(BookedEventsContext);
  if (!ctx) {
    throw new Error(
      "useBookedEvents must be used within a BookedEventsProvider"
    );
  }
  return ctx;
}
