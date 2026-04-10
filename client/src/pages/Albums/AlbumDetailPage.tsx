import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhotoMasonry } from '@/components/gallery/PhotoMasonry';
import { getAlbumBySlug } from '@/services/albumService';
import type { AlbumDetail } from '@/types';

export const AlbumDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getAlbumBySlug(slug)
      .then(setAlbum)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/albums')}
          className="mb-4 inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('albums.backToAlbums')}
        </button>

        {album && (
          <>
            <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              {album.description && <p className="text-gray-600">{album.description}</p>}
              <div className="flex gap-4">
                {album.location && <span>📍 {album.location}</span>}
                {album.date && <span>📅 {new Date(album.date).toLocaleDateString()}</span>}
                <span>
                  {album.photoCount} {album.photoCount === 1 ? t('gallery.photo') : t('gallery.photos')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <PhotoMasonry photos={album?.photos ?? []} loading={loading} />

      {!loading && album?.photos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('albums.noPhotosInAlbum')}</p>
        </div>
      )}
    </div>
  );
};
