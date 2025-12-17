import type { Photo, GalleryCategory } from '@/types';

/**
 * Map of photos by category
 * Photos are loaded from public/photos/{category}/ folder
 */
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

/**
 * Get photos from a specific category
 */
export const getPhotosByCategory = async (category: string): Promise<Photo[]> => {
  const fileNames = PHOTO_MANIFEST[category] || [];
  
  const photos: Photo[] = fileNames.map((fileName) => ({
    id: fileName,
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    description: '',
    url: `/photos/${category}/${fileName}`,
    thumbnailUrl: `/photos/${category}/${fileName}`,
    category: category,
    uploadedAt: new Date().toISOString(),
    likes: Math.floor(Math.random() * 100),
    comments: [],
    userId: 'owner',
  }));

  return photos;
};

/**
 * Get all gallery categories with photo counts
 */
export const getGalleryCategories = async (): Promise<GalleryCategory[]> => {
  const categories: GalleryCategory[] = [
    {
      id: '1',
      name: 'Landscape',
      slug: 'landscape',
      description: 'Beautiful landscape photography',
      photoCount: 0,
    },
    {
      id: '2',
      name: 'Portrait',
      slug: 'portrait',
      description: 'Portrait photography',
      photoCount: 0,
    },
    {
      id: '3',
      name: 'Street',
      slug: 'street',
      description: 'Street photography',
      photoCount: 0,
    },
    {
      id: '4',
      name: 'Nature',
      slug: 'nature',
      description: 'Nature and wildlife photography',
      photoCount: 0,
    },
  ];

  // Load photo counts for each category
  for (const category of categories) {
    const photos = await getPhotosByCategory(category.slug);
    category.photoCount = photos.length;
    if (photos.length > 0) {
      category.coverPhotoUrl = photos[0].thumbnailUrl;
    }
  }

  return categories;
};

/**
 * Get a single photo by ID
 */
export const getPhotoById = async (id: string): Promise<Photo | null> => {
  const photo = SAMPLE_PHOTOS.find(p => p.id === id);
  return photo || null;
};

/**
 * Helper function to scan photos from public folder
 * This is a placeholder - actual implementation will depend on how you organize files
 */
export const scanLocalPhotos = async (_category: string): Promise<string[]> => {
  // This would need to be implemented based on your photo organization
  // For now, return empty array
  // User will manually add photos to public/photos/{category}/ folders
  return [];
};
