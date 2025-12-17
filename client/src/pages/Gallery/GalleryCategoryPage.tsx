import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhotoMasonry } from '@/components/gallery/PhotoMasonry';
import { getPhotosByCategory } from '@/services/photoService';
import type { Photo } from '@/types';

export const GalleryCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        const data = await getPhotosByCategory(category);
        setPhotos(data);
      } catch (error) {
        console.error('Error loading photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [category]);

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/gallery')}
            className="mb-4 inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="mt-2 text-gray-600">
            {photos.length} {photos.length === 1 ? t('gallery.photo') : t('gallery.photos')}
          </p>
        </div>
      </div>

      {/* Photo Masonry Grid */}
      <PhotoMasonry photos={photos} loading={loading} />

      {/* Empty state */}
      {!loading && photos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {t('gallery.noPhotosInCategory')}
          </p>
        </div>
      )}
    </div>
  );
};
