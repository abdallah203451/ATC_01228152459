import { useNavigate, useLocation } from "react-router-dom";
import { Event } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Users, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import BookingSuccess from "./BookingSuccess";
import { BookedEventsProvider } from "@/contexts/BookedEventsContext";
import { useBookedEvents1 } from "@/contexts/BookedEventsContext";
import { useBookedEvents } from "@/hooks/useBookedEvents";

interface EventCardProps {
  event: Event;
  onBookEvent?: (eventId: string, ticketCount: number) => void;
  onCancelEvent?: (eventId: string) => void;
  index?: number;
}

const EventCard = ({
  event,
  onBookEvent,
  onCancelEvent,
  index = 0,
}: EventCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(1);
  const { isEventBooked, addBookedEvent } = useBookedEvents();
  const [isBooked, setIsBooked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const isBookingsRoute = location.pathname.endsWith("/bookings");

  // Check if the event is booked from props or localStorage
  useEffect(() => {
    console.log("Event ID:", event.id);
    console.log("From props:", event.isBooked);
    console.log("From localStorage:", isEventBooked(event.id));
    setIsBooked(event.isBooked || isEventBooked(event.id));
  }, [event.isBooked, event.id, isEventBooked]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options = { locale: language === "en" ? enUS : ar };
    return formatDistanceToNow(date, { ...options, addSuffix: true });
  };

  const formattedPrice =
    event.price === 0
      ? t("events.free")
      : new Intl.NumberFormat(language === "en" ? "en-US" : "ar-EG", {
          style: "currency",
          currency: "USD",
        }).format(event.price);

  const animationConfig = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.1 },
  };

  const { has, add, remove } = useBookedEvents1();
  const isBooked1 = has(event.id);

  const handleBookClick = () => {
    onBookEvent?.(event.id, 1);
    add(event.id);
    navigate("/booking-success");
  };

  const handleDetailsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/events/${event.id}`);
  };

  const handleViewBookings = () => {
    navigate("/bookings");
    setShowSuccess(false);
  };

  const handleExploreMore = () => {
    setShowSuccess(false);
  };

  if (showSuccess) {
    return <BookingSuccess onViewBookings={handleViewBookings} />;
  }

  return (
    <motion.div className="card-highlight" {...animationConfig}>
      <div className="event-card group h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1472396961693-142e6e269027"
            }
            alt={event.name}
            className="event-card-image group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <Badge
              variant={
                event.availableTickets < 10 ? "destructive" : "secondary"
              }
              className={cn(
                "shadow-md backdrop-blur-sm",
                event.availableTickets < 10
                  ? "bg-destructive/80"
                  : "bg-secondary/80 dark:bg-secondary/50"
              )}
            >
              <Users className="w-3 h-3 mr-1" />
              {event.availableTickets} {language === "en" ? "tickets" : "تذاكر"}
            </Badge>

            <Badge
              variant="outline"
              className="bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-md"
            >
              <Tag className="w-3 h-3 mr-1" />
              {event.category}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-bold text-xl text-white mb-1 drop-shadow-md line-clamp-1">
              {event.name}
            </h3>
            <div className="flex items-center text-sm text-white/90 mb-2">
              <Calendar className="h-3 w-3 mr-1 drop-shadow-md" />
              <span className="drop-shadow-md">{formatDate(event.date)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold text-lg text-primary">
              {formattedPrice}
            </span>
            <div className="flex gap-1">
              {event.tags?.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-accent/50 border-accent"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
            {event.description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <Button
              onClick={handleDetailsClick}
              className="rounded-full shadow-md bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 z-10"
            >
              {t("events.details")}
            </Button>

            {isBookingsRoute ? (
              isBooked1 && (
                <Button
                  onClick={() => {
                    remove(event.id);
                    onCancelEvent(event.id);
                  }}
                  variant="destructive"
                  className="rounded-full shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300 z-10"
                >
                  {t("events.cancel")}
                </Button>
              )
            ) : isBooked1 ? (
              <Button
                disabled
                className="rounded-full shadow-md bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 z-10"
              >
                {t("events.booked")}
              </Button>
            ) : (
              <Button
                onClick={handleBookClick}
                className="rounded-full shadow-md bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 z-10"
              >
                {t("events.book")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
