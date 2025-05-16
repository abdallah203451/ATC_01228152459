// src/hooks/useMyBookedEventIds.ts
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function useMyBookedEventIds() {
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    (async () => {
      try {
        const bookings = await api.bookings.getUserBookings();
        // bookings come in shape [{ event: { id: "123", ... } }, …]
        setBookedIds(new Set(bookings.map((b) => b.event.id)));
      } catch {
        // silent fail
      }
    })();
  }, []);
  return bookedIds;
}
