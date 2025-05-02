
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number to compact form (like 1k, 1.5M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    return (num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0) + 'k';
  }
  
  if (num < 1000000000) {
    return (num / 1000000).toFixed(num % 1000000 !== 0 ? 1 : 0) + 'M';
  }
  
  return (num / 1000000000).toFixed(num % 1000000000 !== 0 ? 1 : 0) + 'B';
}
