import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllPhotosWithAssignments, updatePhotoAssignments } from '@/services/photoService';
import { getGalleryCategories } from '@/services/photoService';
import { getAlbums } from '@/services/albumService';
import type { PhotoWithAssignments, GalleryCategory, Album } from '@/types';

export const ManagePage = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<PhotoWithAssignments[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selected, setSelected] = useState<PhotoWithAssignments | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllPhotosWithAssignments(),
      getGalleryCategories(),
      getAlbums(),
    ]).then(([p, c, a]) => {
      setPhotos(p);
      setCategories(c);
      setAlbums(a);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openPhoto = (photo: PhotoWithAssignments) => {
    setSelected(photo);
    setSelectedCategoryIds(new Set(photo.categories.map((c) => c.id)));
    setSelectedAlbumIds(new Set(photo.albums.map((a) => a.id)));
  };

  const toggleId = (id: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updatePhotoAssignments(
        selected.id,
        Array.from(selectedCategoryIds),
        Array.from(selectedAlbumIds),
      );
      setPhotos((prev) =>
        prev.map((p) =>
          p.id !== selected.id ? p : {
            ...p,
            categories: categories.filter((c) => selectedCategoryIds.has(c.id)).map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
            albums: albums.filter((a) => selectedAlbumIds.has(a.id)).map((a) => ({ id: a.id, slug: a.slug, name: a.name })),
          }
        )
      );
      setSelected(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('manage.title')}</h1>
        <p className="mt-2 text-gray-600">{t('manage.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => openPhoto(photo)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-wrap gap-1">
                {photo.categories.map((c) => (
                  <span key={c.id} className="text-[10px] bg-primary-500/80 text-white px-1.5 py-0.5 rounded-full">{c.name}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Assignment modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-4 p-5 border-b">
              <img
                src={selected.url}
                alt={selected.title}
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{selected.title}</h2>
                {selected.captureDate && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(selected.captureDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  {t('manage.categories')}
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.has(cat.id)}
                        onChange={() => toggleId(cat.id, selectedCategoryIds, setSelectedCategoryIds)}
                        className="h-4 w-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{cat.photoCount} photos</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  {t('manage.albums')}
                </h3>
                {albums.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('albums.noAlbumsYet')}</p>
                ) : (
                  <div className="space-y-2">
                    {albums.map((alb) => (
                      <label key={alb.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAlbumIds.has(alb.id)}
                          onChange={() => toggleId(alb.id, selectedAlbumIds, setSelectedAlbumIds)}
                          className="h-4 w-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{alb.name}</span>
                        {alb.location && (
                          <span className="ml-auto text-xs text-gray-400">{alb.location}</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {saving ? t('common.loading') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
