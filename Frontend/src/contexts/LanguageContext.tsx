import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "ar";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// English translations
const enTranslations: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.events": "Events",
  "nav.myBookings": "My Bookings",
  "nav.adminPanel": "Admin Panel",
  "nav.login": "Login",
  "nav.logout": "Logout",
  "nav.register": "Register",

  // Events
  "events.upcomingEvents": "Upcoming Events",
  "events.book": "Book Now",
  "events.booked": "Booked",
  "events.soldOut": "Sold Out",
  "events.free": "Free",
  "events.category": "Category",
  "events.date": "Date",
  "events.time": "Time",
  "events.location": "Location",
  "events.description": "Description",
  "events.price": "Price",
  "events.noEvents": "No events found",
  "events.searchEvents": "Search events...",
  "events.filterBy": "Filter by",
  "events.details": "Details",
  "events.ticketsAvailable": "Available Tickets",
  "events.capacity": "Capacity",
  "events.ctaDescription": "Descover Now",
  "events.readyToExplore": "Ready To Explore",
  "events.heroDescription": "Book Now",
  "events.discoverEvents": "Discover Your Favourite Events",
  "events.featuredEvents": "Featured Events",
  "events.viewAll": "View All",
  "events.exploreAllEvents": "Explore All Events",
  "events.cancel": "Cancel",
  "events.bookNow": "Book Now",
  "events.exploreEvents": "Explore Events",

  // Auth
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm Password",
  "auth.name": "Name",
  "auth.forgotPassword": "Forgot Password?",
  "auth.resetPassword": "Reset Password",
  "auth.login": "Login",
  "auth.register": "Register",
  "auth.logout": "Logout",
  "auth.dontHaveAccount": "Don't have an account?",
  "auth.alreadyHaveAccount": "Already have an account?",

  // Admin
  "admin.dashboard": "Dashboard",
  "admin.events": "Events",
  "admin.users": "Users",
  "admin.createEvent": "Create Event",
  "admin.editEvent": "Edit Event",
  "admin.deleteEvent": "Delete Event",
  "admin.eventName": "Event Name",
  "admin.eventDescription": "Event Description",
  "admin.eventCategory": "Event Category",
  "admin.eventDate": "Event Date",
  "admin.eventTime": "Event Time",
  "admin.eventLocation": "Event Location",
  "admin.eventPrice": "Event Price",
  "admin.eventCapacity": "Event Capacity",
  "admin.eventImage": "Event Image",
  "admin.save": "Save",
  "admin.cancel": "Cancel",
  "admin.confirmDelete": "Are you sure you want to delete this event?",

  // Bookings
  "bookings.myBookings": "My Bookings",
  "bookings.noBookings": "You have no bookings",
  "bookings.bookingDate": "Booking Date",
  "bookings.eventDate": "Event Date",
  "bookings.status": "Status",
  "bookings.cancel": "Cancel Booking",
  "bookings.confirmCancel": "Are you sure you want to cancel this booking?",
  "bookings.pastBookings": "Past Bookings",
  "bookings.upcomingBookings": "Upcoming Bookings",

  // Common
  "common.loading": "Loading...",
  "common.error": "An error occurred",
  "common.success": "Success!",
  "common.submit": "Submit",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.all": "All",
  "common.language": "Language",
  "common.darkMode": "Dark Mode",
  "common.lightMode": "Light Mode",
};

// Arabic translations
const arTranslations: Record<string, string> = {
  // Navigation
  "nav.home": "الرئيسية",
  "nav.events": "الفعاليات",
  "nav.myBookings": "حجوزاتي",
  "nav.adminPanel": "لوحة الإدارة",
  "nav.login": "تسجيل الدخول",
  "nav.logout": "تسجيل الخروج",
  "nav.register": "إنشاء حساب",

  // Events
  "events.upcomingEvents": "الفعاليات القادمة",
  "events.book": "احجز الآن",
  "events.booked": "تم الحجز",
  "events.soldOut": "نفذت التذاكر",
  "events.free": "مجاني",
  "events.category": "الفئة",
  "events.date": "التاريخ",
  "events.time": "الوقت",
  "events.location": "الموقع",
  "events.description": "الوصف",
  "events.price": "السعر",
  "events.noEvents": "لم يتم العثور على فعاليات",
  "events.searchEvents": "البحث عن فعاليات...",
  "events.filterBy": "تصفية حسب",
  "events.details": "التفاصيل",
  "events.ticketsAvailable": "التذاكر المتاحة",
  "events.capacity": "العدد المسموح",
  "events.ctaDescription": "اكتشف الان",
  "events.readyToExplore": "قم بالمتابعة للاستكمال",
  "events.heroDescription": "احجز الآن",
  "events.discoverEvents": "استكشف فعالياتك المفضلة",
  "events.featuredEvents": "الفعاليات المميزة ",
  "events.viewAll": "عرض الكل",
  "events.exploreAllEvents": "استكشف الكل",
  "events.cancel": "الغاء",
  "events.bookNow": "احجز الان",
  "events.exploreEvents": "استكشف الفعاليات",

  // Auth
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.confirmPassword": "تأكيد كلمة المرور",
  "auth.name": "الاسم",
  "auth.forgotPassword": "نسيت كلمة المرور؟",
  "auth.resetPassword": "إعادة تعيين كلمة المرور",
  "auth.login": "تسجيل الدخول",
  "auth.register": "إنشاء حساب",
  "auth.logout": "تسجيل الخروج",
  "auth.dontHaveAccount": "ليس لديك حساب؟",
  "auth.alreadyHaveAccount": "لديك حساب بالفعل؟",

  // Admin
  "admin.dashboard": "لوحة التحكم",
  "admin.events": "الفعاليات",
  "admin.users": "المستخدمين",
  "admin.createEvent": "إنشاء فعالية",
  "admin.editEvent": "تعديل فعالية",
  "admin.deleteEvent": "حذف فعالية",
  "admin.eventName": "اسم الفعالية",
  "admin.eventDescription": "وصف الفعالية",
  "admin.eventCategory": "فئة الفعالية",
  "admin.eventDate": "تاريخ الفعالية",
  "admin.eventTime": "وقت الفعالية",
  "admin.eventLocation": "موقع الفعالية",
  "admin.eventPrice": "سعر الفعالية",
  "admin.eventCapacity": "سعة الفعالية",
  "admin.eventImage": "صورة الفعالية",
  "admin.save": "حفظ",
  "admin.cancel": "إلغاء",
  "admin.confirmDelete": "هل أنت متأكد من أنك تريد حذف هذه الفعالية؟",

  // Bookings
  "bookings.myBookings": "حجوزاتي",
  "bookings.noBookings": "ليس لديك حجوزات",
  "bookings.bookingDate": "تاريخ الحجز",
  "bookings.eventDate": "تاريخ الفعالية",
  "bookings.status": "الحالة",
  "bookings.cancel": "إلغاء الحجز",
  "bookings.confirmCancel": "هل أنت متأكد من أنك تريد إلغاء هذا الحجز؟",
  "bookings.pastBookings": "الحجزات الماضية",
  "bookings.upcomingBookings": "الحجزات القادمة",

  // Common
  "common.loading": "جاري التحميل...",
  "common.error": "حدث خطأ",
  "common.success": "تم بنجاح!",
  "common.submit": "إرسال",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.delete": "حذف",
  "common.edit": "تعديل",
  "common.search": "بحث",
  "common.filter": "تصفية",
  "common.all": "الكل",
  "common.language": "اللغة",
  "common.darkMode": "الوضع المظلم",
  "common.lightMode": "الوضع المضيء",
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage === "ar" ? "ar" : "en") as Language;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    const translations = language === "en" ? enTranslations : arTranslations;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
