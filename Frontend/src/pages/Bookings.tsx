import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Booking } from "@/services/api";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import EventCard from "@/components/EventCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useBookedEvents } from "@/hooks/useBookedEvents";

const Bookings = () => {
  const { t, language } = useLanguage();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await api.bookings.getAll();
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const { removeBookedEvent } = useBookedEvents();

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancelingId(bookingId);
      await api.bookings.cancel(bookingId);

      // Find the booking to get its eventId
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        // Remove from localStorage
        removeBookedEvent(booking.eventId);
      }

      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "PPP", { locale: language === "en" ? enUS : ar });
  };

  const isUpcoming = (date: string): boolean => {
    return new Date(date) > new Date();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">
            {t("bookings.myBookings")}
          </h1>

          {/* …loading & “no bookings” states… */}

          {/* Upcoming bookings */}
          <h2 className="text-xl font-semibold mb-4">
            {t("bookings.upcomingBookings")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {bookings
              .filter((b) => isUpcoming(b.event.date))
              .map((b, idx) => (
                <EventCard
                  key={b.id}
                  index={idx}
                  event={{
                    ...b.event,
                    isBooked: b.status === "confirmed",
                  }}
                  onCancelEvent={() => handleCancelBooking(b.id)}
                />
              ))}
          </div>

          {/* Past bookings */}
          <h2 className="text-xl font-semibold mb-4">
            {t("bookings.pastBookings")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings
              .filter((b) => !isUpcoming(b.event.date))
              .map((b, idx) => (
                <EventCard
                  key={b.id}
                  index={idx}
                  event={{
                    ...b.event,
                    // treat past bookings as “not booked” so only details show
                    isBooked: false,
                  }}
                  // no handlers here
                />
              ))}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Bookings;
