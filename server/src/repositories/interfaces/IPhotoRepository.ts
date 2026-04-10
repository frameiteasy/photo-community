import type { Photo, GalleryCategory, PhotoWithAssignments, UpdateAssignmentsInput } from '../../types';

export interface IPhotoRepository {
  getCategories(): Promise<GalleryCategory[]>;
  getPhotosByCategory(slug: string): Promise<Photo[]>;
  getRecent(limit: number): Promise<Photo[]>;
  getAllWithAssignments(): Promise<PhotoWithAssignments[]>;
  getByIdWithAssignments(id: string): Promise<PhotoWithAssignments | null>;
  updateAssignments(id: string, input: UpdateAssignmentsInput): Promise<void>;
}
