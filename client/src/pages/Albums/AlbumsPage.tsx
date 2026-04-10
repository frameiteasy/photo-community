import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAlbums } from '@/services/albumService';
import type { Album } from '@/types';

export const AlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getAlbums()
      .then(setAlbums)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('albums.title')}</h1>
        <p className="mt-2 text-gray-600">{t('albums.subtitle')}</p>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('albums.noAlbumsYet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.slug}`}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 bg-gray-200">
                {album.coverPhotoUrl ? (
                  <img
                    src={album.coverPhotoUrl}
                    alt={album.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-6xl text-gray-400">🗂️</span>
                  </div>
                )}
                {album.location && (
                  <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {album.location}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                  {album.name}
                </h3>
                {album.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{album.description}</p>
                )}
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {album.photoCount} {album.photoCount === 1 ? t('gallery.photo') : t('gallery.photos')}
                  </span>
                  {album.date && (
                    <span>{new Date(album.date).getFullYear()}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
