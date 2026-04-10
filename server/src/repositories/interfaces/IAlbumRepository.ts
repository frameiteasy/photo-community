import type { Album, AlbumDetail } from '../../types';

export interface IAlbumRepository {
  getAlbums(): Promise<Album[]>;
  getAlbumBySlug(slug: string): Promise<AlbumDetail | null>;
}
