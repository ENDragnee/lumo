// lib/format-date.ts

import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Formats a date string into a human-readable relative time (e.g., "about 3 hours ago").
 * 
 * @param dateString - The date string from the API (e.g., "2024-05-24T10:30:00.000Z")
 * @returns A formatted string, or an empty string if the date is invalid.
 */
export function formatRelativeDate(dateString?: string | Date): string {
  if (!dateString) {
    return ''; // Return empty if no date is provided
  }
  
  try {
    // parseISO is robust and handles the standard date format from your database
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    // Add a suffix like "ago"
    return formatDistanceToNow(date, { addSuffix: true });

  } catch (error) {
    console.error("Failed to format date:", error);
    return 'Invalid date'; // Return an error message or empty string
  }
}

/**
 * Formats a date string into a simple, absolute format (e.g., "May 24, 2024").
 * 
 * @param dateString - The date string from the API.
 * @returns A formatted string.
 */
export function formatAbsoluteDate(dateString?: string | Date): string {
  if (!dateString) {
    return '';
  }
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    // 'PPP' is a token for a long, localized date format like "May 24th, 2024"
    return format(date, 'PPP'); 
    
  } catch (error) {
    console.error("Failed to format date:", error);
    return 'Invalid date';
  }
}
