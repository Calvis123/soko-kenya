import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatPhoneForMpesa(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("254")) {
    return cleaned;
  }
  if (cleaned.startsWith("0")) {
    return `254${cleaned.slice(1)}`;
  }
  return cleaned;
}
