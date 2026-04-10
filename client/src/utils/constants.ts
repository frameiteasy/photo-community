// Environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
export const PHOTOS_BASE_PATH = '/photos';

// App configuration
export const APP_NAME = 'Photo Community';
export const APP_DESCRIPTION = 'A private photo-sharing community';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const GALLERY_PAGE_SIZE = 24;

// Photo categories
export const PHOTO_CATEGORIES = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'street', label: 'Street' },
  { value: 'nature', label: 'Nature' },
  { value: 'other', label: 'Other' },
] as const;
