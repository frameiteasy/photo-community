import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '@/types';
import { extractMetadata, formatMetadata, type PhotoMetadata } from '@/utils/metadata';
import { PhotoComments } from './PhotoComments';

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PhotoLightbox = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoLightboxProps) => {
  const currentPhoto = photos[currentIndex];
  const totalPhotos = photos.length;
  const [metadata, setMetadata] = useState<PhotoMetadata | null>(null);
  const [showComments, setShowComments] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onNavigate(currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNavigate(currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalPhotos, onClose, onNavigate]);

  // Load EXIF metadata when photo changes
  useEffect(() => {
    extractMetadata(currentPhoto.url).then(setMetadata);
  }, [currentPhoto.url]);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left') {
        onNavigate(currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1);
      } else {
        onNavigate(currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1);
      }
    },
    [currentIndex, totalPhotos, onNavigate]
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        onClick={onClose}
      >
        {/* ── Top bar ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 h-14 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-white/60 text-sm font-medium">
            {currentIndex + 1} / {totalPhotos}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle comments (mobile) */}
            <button
              onClick={() => setShowComments((v) => !v)}
              className="md:hidden flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/70 hover:text-white text-sm transition-colors"
              aria-label="Toggle comments"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body: photo + sidebar ── */}
        <div className="flex-1 flex min-h-0">

          {/* Photo area */}
          <div
            className="flex-1 flex flex-col relative min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex items-center justify-center px-12 min-h-0"
              drag="x"
              dragElastic={0.15}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) {
                  handleSwipe(info.offset.x > 0 ? 'right' : 'left');
                }
              }}
            >
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </motion.div>

            {/* Metadata bar */}
            {metadata && (
              <div className="flex-shrink-0 px-6 pb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {formatMetadata(metadata).map((item, idx) => (
                    <span key={idx} className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nav arrows */}
            {totalPhotos > 1 && (
              <>
                <button
                  onClick={() => onNavigate(currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors hidden md:flex"
                  aria-label="Previous photo"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => onNavigate(currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors hidden md:flex"
                  aria-label="Next photo"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Mobile swipe hint */}
            <p className="flex-shrink-0 pb-2 text-center text-white/30 text-xs md:hidden">
              Swipe to navigate
            </p>
          </div>

          {/* ── Comments sidebar (desktop always visible) ── */}
          <div
            className="hidden md:flex w-80 flex-col border-l border-white/10 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <PhotoComments photoId={currentPhoto.id} />
          </div>
        </div>

        {/* ── Mobile comments panel (slides up) ── */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-x-0 bottom-0 h-2/3 bg-gray-900 rounded-t-2xl z-20 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
              <PhotoComments photoId={currentPhoto.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
