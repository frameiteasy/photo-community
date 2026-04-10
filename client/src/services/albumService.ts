import { apiClient } from './api';
import type { Album, AlbumDetail } from '@/types';

export const getAlbums = async (): Promise<Album[]> => {
  const { data } = await apiClient.get<Album[]>('/v1/albums');
  return data;
};

export const getAlbumBySlug = async (slug: string): Promise<AlbumDetail> => {
  const { data } = await apiClient.get<AlbumDetail>(`/v1/albums/${slug}`);
  return data;
};
