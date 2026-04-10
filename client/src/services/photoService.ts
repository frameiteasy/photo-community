import { apiClient } from './api';
import type { Photo, GalleryCategory, PhotoWithAssignments } from '@/types';

export const getGalleryCategories = async (): Promise<GalleryCategory[]> => {
  const { data } = await apiClient.get<GalleryCategory[]>('/v1/gallery/categories');
  return data;
};

export const getPhotosByCategory = async (category: string): Promise<Photo[]> => {
  const { data } = await apiClient.get<Photo[]>(`/v1/gallery/categories/${category}/photos`);
  return data;
};

export const getRecentPhotos = async (limit = 12): Promise<Photo[]> => {
  const { data } = await apiClient.get<Photo[]>('/v1/gallery/recent', { params: { limit } });
  return data;
};

export const getAllPhotosWithAssignments = async (): Promise<PhotoWithAssignments[]> => {
  const { data } = await apiClient.get<PhotoWithAssignments[]>('/v1/photos');
  return data;
};

export const updatePhotoAssignments = async (
  id: string,
  categoryIds: string[],
  albumIds: string[],
): Promise<void> => {
  await apiClient.put(`/v1/photos/${id}/assignments`, { categoryIds, albumIds });
};
