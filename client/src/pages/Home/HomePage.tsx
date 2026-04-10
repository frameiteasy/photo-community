import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getRecentPhotos, getGalleryCategories } from '@/services/photoService';
import { getAlbums } from '@/services/albumService';
import { PhotoLightbox } from '@/components/gallery/PhotoLightbox';
import { getBlogPosts } from '@/services/blogService';

const HERO_PHOTOS = [
  '/photos/landscape/20220214-_KMS9994.jpg',
  '/photos/landscape/DSCF0194.jpg',
  '/photos/landscape/20251027-KMS07249.jpg',
  '/photos/nature/20250721-KMS02711.jpg',
];

// Selected once at module load — intentionally not reactive
const initialHeroPhoto = HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)];

export const HomePage = () => {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroPhoto = useMemo(() => initialHeroPhoto, []);

  const { data: recentPhotos = [] } = useQuery({
    queryKey: ['recentPhotos'],
    queryFn: () => getRecentPhotos(12),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['galleryCategories'],
    queryFn: getGalleryCategories,
  });

  const categoriesWithPhotos = categories.filter((c) => c.photoCount > 0);

  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: getAlbums,
  });
  const albumsWithPhotos = albums.filter((a) => a.photoCount > 0);

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog'],
    queryFn: getBlogPosts,
  });
  const recentBlogPosts = blogPosts.slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.img
          src={heroPhoto}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />

        <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('home.hero.tagline')}
          </motion.h1>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              to="/gallery"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow hover:bg-gray-100 transition-colors"
            >
              {t('home.hero.ctaGallery')}
            </Link>
            <Link
              to="/blog"
              className="text-base font-semibold text-white/90 hover:text-white transition-colors"
            >
              {t('home.hero.ctaWalks')} <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Recent Photos ── */}
      {recentPhotos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('home.sections.recentPhotos')}
            </h2>
            <Link
              to="/gallery"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              {t('home.sections.seeAll')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group cursor-pointer overflow-hidden rounded-lg bg-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.07 }}
                onClick={() => setLightboxIndex(index)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          {lightboxIndex !== null && (
            <PhotoLightbox
              photos={recentPhotos}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              onNavigate={setLightboxIndex}
            />
          )}
        </section>
      )}

      {/* ── Categories ── */}
      {categoriesWithPhotos.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('home.sections.browseByCategory')}
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {categoriesWithPhotos.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link
                    to={`/gallery/${category.slug}`}
                    className="block relative h-48 rounded-xl overflow-hidden bg-gray-300 group"
                  >
                    {category.coverPhotoUrl && (
                      <img
                        src={category.coverPhotoUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-semibold text-lg leading-tight">
                        {(
                          {
                            landscape: t('gallery.landscape'),
                            nature: t('gallery.nature'),
                            portrait: t('gallery.portrait'),
                            street: t('gallery.street'),
                          } as Record<string, string>
                        )[category.slug] ?? category.name}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {category.photoCount}{' '}
                        {category.photoCount === 1
                          ? t('gallery.photo')
                          : t('gallery.photos')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Albums ── */}
      {albumsWithPhotos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('home.sections.browseByAlbum')}
            </h2>
            <Link
              to="/albums"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              {t('home.sections.seeAllAlbums')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {albumsWithPhotos.slice(0, 3).map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  to={`/albums/${album.slug}`}
                  className="block relative h-56 rounded-xl overflow-hidden bg-gray-300 group"
                >
                  {album.coverPhotoUrl && (
                    <img
                      src={album.coverPhotoUrl}
                      alt={album.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white font-semibold text-lg leading-tight">{album.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {album.location && (
                        <span className="text-white/70 text-xs">📍 {album.location}</span>
                      )}
                      {album.date && (
                        <span className="text-white/70 text-xs">
                          {new Date(album.date).getFullYear()}
                        </span>
                      )}
                      <span className="text-white/70 text-xs">
                        {album.photoCount} {album.photoCount === 1 ? t('gallery.photo') : t('gallery.photos')}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent Blog Posts ── */}
      {recentBlogPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('home.sections.fromTheBlog')}
            </h2>
            <Link
              to="/blog"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              {t('home.sections.readAllPosts')} →
            </Link>
          </div>

          <div className="space-y-4">
            {recentBlogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex items-center gap-5 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={post.coverPhotoUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <svg className="flex-shrink-0 w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
