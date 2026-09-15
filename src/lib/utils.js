import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Unsplash serves originals (several MB) unless asked to resize via imgix params.
// Requesting a size close to the rendered dimensions cuts payload by ~40x.
export function optimizeImage(url, width) {
  if (!url || !url.includes("images.unsplash.com")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&q=70&auto=format&fit=crop`;
}
