import type { IPhotoRepository } from '../interfaces/IPhotoRepository';
import type { Photo, GalleryCategory, PhotoCategory, PhotoWithAssignments, UpdateAssignmentsInput } from '../../types';

const PHOTO_MANIFEST: Record<string, string[]> = {
  landscape: [
    '20220214-_KMS9994.jpg',
    '20221112-_KMS4056.jpg',
    '20251027-KMS07249.jpg',
    'DSCF0194.jpg',
  ],
  nature: [
    '20250427-_KMS5167.jpg',
    '20250427-_KMS5419.jpg',
    '20250721-KMS02711.jpg',
  ],
  portrait: [],
  street: [],
};

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  landscape: { name: 'Landscape', description: 'Beautiful landscape photography' },
  nature:    { name: 'Nature',    description: 'Nature and wildlife photography' },
  portrait:  { name: 'Portrait',  description: 'Portrait photography' },
  street:    { name: 'Street',    description: 'Street photography' },
};

function buildPhoto(category: string, fileName: string): Photo {
  return {
    id: `${category}/${fileName}`,
    url: `/photos/${category}/${fileName}`,
    thumbnailUrl: `/photos/${category}/${fileName}`,
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    category: category as PhotoCategory,
  };
}

export class MockPhotoRepository implements IPhotoRepository {
  async getPhotosByCategory(slug: string): Promise<Photo[]> {
    return (PHOTO_MANIFEST[slug] ?? []).map((f) => buildPhoto(slug, f));
  }

  async getCategories(): Promise<GalleryCategory[]> {
    return Promise.all(
      Object.entries(PHOTO_MANIFEST).map(async ([slug, files], i) => {
        const meta = CATEGORY_META[slug];
        const coverPhotoUrl = files[0] ? `/photos/${slug}/${files[0]}` : undefined;
        return {
          id: String(i + 1),
          slug,
          name: meta.name,
          description: meta.description,
          photoCount: files.length,
          coverPhotoUrl,
        };
      }),
    );
  }

  async getAllWithAssignments(): Promise<PhotoWithAssignments[]> { return []; }
  async getByIdWithAssignments(_id: string): Promise<PhotoWithAssignments | null> { return null; }
  async updateAssignments(_id: string, _input: UpdateAssignmentsInput): Promise<void> {}

  async getRecent(limit: number): Promise<Photo[]> {
    const all = Object.entries(PHOTO_MANIFEST).flatMap(([slug, files]) =>
      files.map((f) => buildPhoto(slug, f)),
    );
    return all.slice(0, limit);
  }
}
