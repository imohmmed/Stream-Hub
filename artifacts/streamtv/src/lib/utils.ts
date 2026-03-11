import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes?: string | number) {
  if (!minutes) return "";
  const num = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
  if (isNaN(num)) return minutes;
  const h = Math.floor(num / 60);
  const m = num % 60;
  return h > 0 ? `${h}س ${m}د` : `${m}د`;
}
