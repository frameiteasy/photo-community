import type { IPhotoRepository } from '../repositories/interfaces/IPhotoRepository';
import type { Photo, GalleryCategory, PhotoWithAssignments, UpdateAssignmentsInput } from '../types';

export class PhotoService {
  constructor(private repo: IPhotoRepository) {}

  getCategories(): Promise<GalleryCategory[]> {
    return this.repo.getCategories();
  }

  getPhotosByCategory(slug: string): Promise<Photo[]> {
    return this.repo.getPhotosByCategory(slug);
  }

  getRecent(limit = 12): Promise<Photo[]> {
    return this.repo.getRecent(limit);
  }

  getAllWithAssignments(): Promise<PhotoWithAssignments[]> {
    return this.repo.getAllWithAssignments();
  }

  getByIdWithAssignments(id: string): Promise<PhotoWithAssignments | null> {
    return this.repo.getByIdWithAssignments(id);
  }

  updateAssignments(id: string, input: UpdateAssignmentsInput): Promise<void> {
    return this.repo.updateAssignments(id, input);
  }
}
