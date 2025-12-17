import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GalleryCategory } from '@/types';
import { getGalleryCategories } from '@/services/photoService';

export const GalleryPage = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getGalleryCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('gallery.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('gallery.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/gallery/${category.slug}`}
            className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative h-64">
              {category.coverPhotoUrl ? (
                <img
                  src={category.coverPhotoUrl}
                  alt={category.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-6xl text-gray-400">📷</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-gray-600">{category.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {category.photoCount} {category.photoCount === 1 ? t('gallery.photo') : t('gallery.photos')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('gallery.noCategoriesAvailable')}</p>
          <p className="text-sm text-gray-400 mt-2">
            {t('gallery.addPhotosToGetStarted')}
          </p>
        </div>
      )}
    </div>
  );
};
