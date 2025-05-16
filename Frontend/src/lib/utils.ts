import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert relative image paths to absolute URLs
export function getFullImageUrl(imagePath: string | null | undefined): string {
  // Return default image if no path provided
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1472396961693-142e6e269027";
  }

  // If it's already an absolute URL (starts with http:// or https://) return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Get the backend base URL from environment variables
  var backendBaseUrl = import.meta.env.VITE_API_URL || "";
  backendBaseUrl = backendBaseUrl.slice(0, -3);

  // If the image path starts with a slash, append it to the backend base URL
  if (imagePath.startsWith("/")) {
    return `${backendBaseUrl}${imagePath}`;
  }

  // Otherwise, add a slash before appending
  return `${backendBaseUrl}/${imagePath}`;
}
