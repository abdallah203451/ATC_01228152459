import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Event } from "@/services/api";
import AdminLayout from "@/components/admin/AdminLayout";
import EventForm from "@/components/admin/EventForm";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await api.events.getById(id);
        data.tags = [];
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Link
            to="/admin/events"
            className="mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">{t("admin.editEvent")}</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-64 skeleton rounded-lg" />
            <div className="h-12 skeleton w-1/3" />
            <div className="h-12 skeleton w-2/3" />
            <div className="h-32 skeleton" />
          </div>
        ) : event ? (
          <EventForm eventId={id} initialData={event} />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">
              {t("events.eventNotFound")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("events.eventNotFoundDesc")}
            </p>
            <Link to="/admin/events" className="text-primary hover:underline">
              {t("admin.backToEvents")}
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditEvent;
