import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '@/types';
import { extractMetadata, formatMetadata, type PhotoMetadata } from '@/utils/metadata';

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
  const [loadingMetadata, setLoadingMetadata] = useState(false);

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

  // Load metadata when photo changes
  useEffect(() => {
    const loadMetadata = async () => {
      setLoadingMetadata(true);
      const data = await extractMetadata(currentPhoto.url);
      console.log('📷 Photo Metadata:', {
        photo: currentPhoto.title,
        url: currentPhoto.url,
        metadata: data,
      });
      setMetadata(data);
      setLoadingMetadata(false);
    };

    loadMetadata();
  }, [currentIndex, currentPhoto.url]);

  // Handle swipe gestures
  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left') {
        // Swipe left = next photo
        onNavigate(currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1);
      } else {
        // Swipe right = previous photo
        onNavigate(currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1);
      }
    },
    [currentIndex, totalPhotos, onNavigate]
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
          aria-label="Close lightbox"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo counter */}
        <div className="absolute top-4 left-4 text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
          {currentIndex + 1} / {totalPhotos}
        </div>

        {/* Main photo container with swipe support */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center max-w-6xl max-h-[90vh]"
          drag="x"
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            if (Math.abs(info.offset.x) > swipeThreshold) {
              handleSwipe(info.offset.x > 0 ? 'right' : 'left');
            }
          }}
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </motion.div>

        {/* Navigation arrows */}
        {totalPhotos > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 hover:bg-white/30 transition-colors hidden md:flex"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 hover:bg-white/30 transition-colors hidden md:flex"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Photo info */}
        <div className="absolute bottom-4 left-4 right-4 text-white text-center">
          {currentPhoto.description && (
            <p className="text-sm text-gray-300">{currentPhoto.description}</p>
          )}

          {/* Metadata */}
          {metadata && !loadingMetadata && (
            <div className="mt-3 pt-3 border-t border-white/30">
              <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-300">
                {formatMetadata(metadata).map((item, idx) => (
                  <span key={idx} className="bg-white/10 px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint (mobile) */}
        <div className="absolute bottom-4 text-white/50 text-xs text-center md:hidden">
          Swipe to navigate • Tap to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
