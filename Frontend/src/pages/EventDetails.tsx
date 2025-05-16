import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api, Event } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Tag } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import BookingSuccess from "@/components/BookingSuccess";
import { useBookedEvents1 } from "@/contexts/BookedEventsContext";
const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { has, add, remove } = useBookedEvents1();
  const isBooked1 = event ? has(event.id) : false;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await api.events.getById(id);
        setEvent(data);
      } catch {
        toast.error(t("events.loadError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      toast.error(t("events.loginToBook"));
      navigate("/login");
      return;
    }
    if (!event || event.isBooked) return;
    try {
      setIsBooking(true);
      await api.bookings.create(event.id);
      setEvent((prev) => (prev ? { ...prev, isBooked: true } : null));
      navigate("/booking-success");
    } catch {
      toast.error(t("events.bookFail"));
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "PPP", {
      locale: language === "en" ? enUS : ar,
    });

  const handleViewBookings = () => {
    navigate("/bookings");
  };

  const handleExploreMore = () => {
    setShowSuccess(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-6" />
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
        </div>
      </Layout>
    );
  }

  if (showSuccess) {
    return (
      <Layout>
        <BookingSuccess onViewBookings={handleViewBookings} />
      </Layout>
    );
  }

  return (
    <Layout>
      {event && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-12 flex flex-col lg:flex-row gap-8"
        >
          {/* Hero Image */}
          <div className="lg:w-2/3">
            <div className="relative">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <h1 className="text-3xl font-bold">{event.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1 text-primary" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-1 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-6 prose prose-lg dark:prose-invert">
              <h2>{t("events.description")}</h2>
              <p>{event.description}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="outline">{event.category}</Badge>
              {event.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-4xl font-extrabold">
                  {event.price === 0
                    ? t("events.free")
                    : new Intl.NumberFormat(
                        language === "en" ? "en-US" : "ar-EG",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      ).format(event.price)}
                </span>
                {event.availableTickets < 10 && (
                  <Badge variant="destructive">
                    {event.availableTickets} {t("events.ticketsLeft")}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {event.isBooked ? (
                  <Button disabled variant="secondary" className="w-full">
                    {t("events.booked")}
                  </Button>
                ) : event.availableTickets === 0 ? (
                  <Button disabled variant="destructive" className="w-full">
                    {t("events.soldOut")}
                  </Button>
                ) : isBooked1 ? (
                  <Button
                    disabled
                    className="w-full text-lg py-3"
                  >
                    Booked
                  </Button>
                ) : (
                  <Button
                    onClick={handleBookEvent}
                    disabled={isBooking}
                    className="w-full text-lg py-3"
                  >
                    {isBooking ? t("common.loading") : t("events.bookNow")}
                  </Button>
                )}

                <div className="text-sm text-muted-foreground">
                  <p>
                    {event.capacity} {t("events.capacity")}
                  </p>
                  <p>
                    {event.availableTickets} {t("events.ticketsAvailable")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Layout>
  );
};

export default EventDetails;
