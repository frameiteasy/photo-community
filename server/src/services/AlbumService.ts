import type { IAlbumRepository } from '../repositories/interfaces/IAlbumRepository';
import type { Album, AlbumDetail } from '../types';

export class AlbumService {
  constructor(private repo: IAlbumRepository) {}

  getAlbums(): Promise<Album[]> {
    return this.repo.getAlbums();
  }

  getAlbumBySlug(slug: string): Promise<AlbumDetail | null> {
    return this.repo.getAlbumBySlug(slug);
  }
}
