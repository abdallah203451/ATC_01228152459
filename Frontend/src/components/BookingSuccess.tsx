// src/components/BookingSuccess.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingSuccessProps {
  onViewBookings?: () => void;
}

export default function BookingSuccess({
  onViewBookings,
}: BookingSuccessProps) {
  const navigate = useNavigate();

  const handleViewBookings = () => {
    if (onViewBookings) {
      onViewBookings();
    } else {
      navigate("/bookings");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-center space-y-6"
      >
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-300" />
        </div>
        <h2 className="text-2xl font-extrabold">🎉 Congratulations!</h2>
        <p className="text-muted-foreground">
          You've successfully booked your tickets. We can't wait to see you
          there!
        </p>
        <div className="flex justify-center">
          <Button onClick={handleViewBookings} className="px-8">
            View My Bookings
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
