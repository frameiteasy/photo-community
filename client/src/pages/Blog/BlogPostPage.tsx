import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getBlogPost, type ContentBlock } from '@/services/blogService';

// ─── Photo zoom overlay ────────────────────────────────────────────────────────

function PhotoZoom({ urls, startIndex, onClose }: { urls: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const total = urls.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      {total > 1 && (
        <div className="absolute top-4 left-4 text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full">
          {idx + 1} / {total}
        </div>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={urls[idx]}
          alt=""
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {/* Nav arrows */}
      {total > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 hover:bg-white/30 transition-colors"
            onClick={(e) => { e.stopPropagation(); setIdx(idx === 0 ? total - 1 : idx - 1); }}
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 hover:bg-white/30 transition-colors"
            onClick={(e) => { e.stopPropagation(); setIdx(idx === total - 1 ? 0 : idx + 1); }}
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </motion.div>
  );
}

// ─── Content block renderers ──────────────────────────────────────────────────

function TextBlock({ content }: { content: string }) {
  return (
    <div className="mx-auto max-w-[65ch]">
      {content.split('\n\n').map((para, i) => (
        <p key={i} className="text-gray-700 text-base leading-8 mb-5 last:mb-0">
          {para}
        </p>
      ))}
    </div>
  );
}

function SinglePhotoBlock({ url, caption, onZoom }: { url: string; caption?: string; onZoom: () => void }) {
  return (
    <figure className="mx-auto max-w-3xl">
      <div
        className="overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in"
        onClick={onZoom}
      >
        <img
          src={url}
          alt={caption ?? ''}
          className="w-full object-cover hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-400 italic">{caption}</figcaption>
      )}
    </figure>
  );
}

function PhotosBlock({ urls, layout, onZoom }: { urls: string[]; layout: 'grid' | 'strip'; onZoom: (i: number) => void }) {
  if (layout === 'strip') {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {urls.map((url, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-72 h-52 rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in snap-start"
            onClick={() => onZoom(i)}
          >
            <img src={url} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300" />
          </div>
        ))}
      </div>
    );
  }

  // grid
  const cols = urls.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';
  return (
    <div className={`grid ${cols} gap-3`}>
      {urls.map((url, i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
          onClick={() => onZoom(i)}
        >
          <img src={url} alt="" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-300" />
        </div>
      ))}
    </div>
  );
}

function Block({ block, onZoom }: { block: ContentBlock; onZoom: (urls: string[], i: number) => void }) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content} />;
    case 'photo':
      return <SinglePhotoBlock url={block.url} caption={block.caption} onZoom={() => onZoom([block.url], 0)} />;
    case 'photos':
      return <PhotosBlock urls={block.urls} layout={block.layout} onZoom={(i) => onZoom(block.urls, i)} />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const BlogPostPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [zoom, setZoom] = useState<{ urls: string[]; index: number } | null>(null);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogPost(slug!),
    enabled: !!slug,
  });

  if (!slug) return <Navigate to="/blog" replace />;
  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-400">{t('common.loading')}</div>;
  if (isError || !post) return <Navigate to="/blog" replace />;

  const { prev, next } = post.adjacent;
  const mins = post.readingTime;

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.backToBlog')}
          </Link>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>{t('blog.readingTime', { count: mins })}</span>
            </div>
          </motion.header>

          {/* Content blocks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-10"
          >
            {post.blocks.map((block, i) => (
              <Block
                key={i}
                block={block}
                onZoom={(urls, idx) => setZoom({ urls, index: idx })}
              />
            ))}
          </motion.div>

          {/* Prev / Next navigation */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex items-stretch justify-between gap-4">
              {prev ? (
                <Link
                  to={`/blog/${prev.slug}`}
                  className="group flex-1 flex flex-col gap-1 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    ← {t('blog.prevPost')}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-700 line-clamp-2">
                    {prev.title}
                  </span>
                </Link>
              ) : <div className="flex-1" />}

              {next ? (
                <Link
                  to={`/blog/${next.slug}`}
                  className="group flex-1 flex flex-col gap-1 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors text-right"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {t('blog.nextPost')} →
                  </span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-700 line-clamp-2">
                    {next.title}
                  </span>
                </Link>
              ) : <div className="flex-1" />}
            </div>
          </div>

        </div>
      </div>

      {/* Photo zoom overlay */}
      <AnimatePresence>
        {zoom && (
          <PhotoZoom
            urls={zoom.urls}
            startIndex={zoom.index}
            onClose={() => setZoom(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
