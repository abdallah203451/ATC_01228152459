import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Event, Category, Tag } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale"; // Add the missing imports
import {
  Calendar as CalendarIcon,
  Clock,
  Image,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventFormProps {
  eventId?: string;
  initialData?: Partial<Event>;
}

const EventForm = ({ eventId, initialData }: EventFormProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Partial<Event>>(
    initialData || {
      name: "",
      description: "",
      category: "",
      date: "",
      time: "",
      location: "",
      price: 0,
      capacity: 100,
      tags: [],
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const isEditMode = !!eventId;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.events.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const data = await api.tags.getAll();
        setTags(data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setEvent((prev) => ({ ...prev, date: date.toISOString().split("T")[0] }));
      setShowCalendar(false);
    }
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTags((current) => {
      // If already selected, remove it
      if (current.includes(tagId)) {
        return current.filter((id) => id !== tagId);
      }
      // Otherwise, add it
      return [...current, tagId];
    });
  };

  // Add useEffect to update event.tags when selectedTags changes
  useEffect(() => {
    setEvent((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
  }, [selectedTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !event.name ||
      !event.description ||
      !event.category || // this is now the category *ID* as a string
      !event.date ||
      !event.time ||
      !event.location
    ) {
      toast.error(t("admin.fillAllFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // 1) Scalars
      formData.append("Name", event.name);
      formData.append("Description", event.description);
      formData.append("CategoryId", event.category); // <-- send the category *ID*
      formData.append("EventDate", `${event.date}T${event.time}`);
      formData.append("Venue", event.location);
      formData.append("Price", event.price.toString());
      formData.append("Capacity", event.capacity.toString());

      // 2) Tags array
      selectedTags.forEach((tagId) => {
        formData.append("TagIds", tagId);
      });
      // formData.append("TagIds", JSON.stringify(selectedTags));

      // 3) Optional image
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      // 4) Call your API
      if (isEditMode) {
        await api.events.update(eventId!, formData);
        toast.success(t("admin.eventUpdated"));
      } else {
        await api.events.create(formData);
        toast.success(t("admin.eventCreated"));
      }

      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      toast.error(
        isEditMode ? t("admin.updateFailed") : t("admin.createFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = event.date
    ? format(new Date(event.date), "PPP", {
        locale: language === "ar" ? ar : enUS,
      })
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Image */}
      <div className="space-y-2">
        <Label>{t("admin.eventImage")}</Label>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="event-image"
          />
          <label htmlFor="event-image" className="cursor-pointer w-full">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="max-h-64 mx-auto rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <div className="bg-white p-2 rounded-full">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Image className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("admin.dropImageHere")}
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Name */}
        <div className="space-y-2">
          <Label htmlFor="name">{t("admin.eventName")}</Label>
          <Input
            id="name"
            name="name"
            value={event.name}
            onChange={handleChange}
            placeholder={t("admin.eventNamePlaceholder")}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t("admin.eventCategory")}</Label>
          <Select
            value={event.category}
            onValueChange={(value) =>
              setEvent((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={t("admin.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">{t("admin.eventTags")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedTags.length > 0
                  ? `${selectedTags.length} ${t("admin.tagsSelected")}`
                  : t("selectTags")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={t("admin.searchTags")} />
                <CommandList>
                  <CommandEmpty>{t("admin.noTagsFound")}</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {tags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => handleTagSelect(tag.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Display selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                    <span className="ml-1 text-xs">×</span>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">{t("admin.eventDate")}</Label>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !event.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {event.date ? (
                  formattedDate
                ) : (
                  <span>{t("admin.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={event.date ? new Date(event.date) : undefined}
                onSelect={handleDateSelect}
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label htmlFor="time">{t("admin.eventTime")}</Label>
          <div className="relative">
            <Input
              id="time"
              name="time"
              type="time"
              value={event.time}
              onChange={handleChange}
              required
              className="pl-10"
            />
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">{t("admin.eventLocation")}</Label>
          <Input
            id="location"
            name="location"
            value={event.location}
            onChange={handleChange}
            placeholder={t("admin.eventLocationPlaceholder")}
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">{t("admin.eventPrice")}</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              $
            </span>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={event.price}
              onChange={handleNumberChange}
              className="pl-8"
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="capacity">{t("admin.eventCapacity")}</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            value={event.capacity}
            onChange={handleNumberChange}
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">{t("admin.eventDescription")}</Label>
          <Textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleChange}
            placeholder={t("admin.eventDescriptionPlaceholder")}
            className="min-h-32"
            required
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/events")}
        >
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("common.loading")
            : isEditMode
            ? t("admin.updateEvent")
            : t("admin.createEvent")}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
