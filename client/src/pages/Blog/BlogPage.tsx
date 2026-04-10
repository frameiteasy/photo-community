import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '@/services/blogService';

const GRID_COUNT = 3; // posts shown in the preview grid (after featured)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export const BlogPage = () => {
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog'],
    queryFn: getBlogPosts,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-400">{t('common.loading')}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-400">
        {t('blog.noPostsYet')}
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const gridPosts = rest.slice(0, GRID_COUNT);
  const morePosts = rest.slice(GRID_COUNT);          // post 5 onward
  const hasMore   = morePosts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('blog.title')}</h1>

        {/* ── Featured post ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to={`/blog/${featured.slug}`}
            className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 mb-8"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-[55%] aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={featured.coverPhotoUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col justify-center px-7 py-8 md:py-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3">
                  {t('blog.latestPost')}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-primary-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{formatDate(featured.publishedAt)}</span>
                  <span className="text-sm font-semibold text-primary-600 group-hover:underline">
                    {t('blog.readMore')} →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Preview grid (posts 2–4) ── */}
        {gridPosts.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('blog.previousPosts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {gridPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                      <img
                        src={post.coverPhotoUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{formatDate(post.publishedAt)}</p>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ── More posts toggle ── */}
        {hasMore && (
          <div>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-2 mx-auto text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors py-2 px-4 rounded-full border border-gray-200 hover:border-gray-400 bg-white mb-4"
            >
              {t('blog.morePosts')}
              <motion.svg
                className="w-4 h-4"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ rotate: moreOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                    {morePosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-200">
                          <img
                            src={post.coverPhotoUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-300"
                          />
                        </div>
                        <p className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {post.title}
                        </p>
                        <span className="flex-shrink-0 text-xs text-gray-400 ml-2">
                          {formatDate(post.publishedAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};
