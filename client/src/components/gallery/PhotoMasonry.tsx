import { useState } from 'react';
import type { Photo } from '@/types';
import { PhotoLightbox } from './PhotoLightbox';

interface PhotoMasonryProps {
  photos: Photo[];
  loading?: boolean;
}

export const PhotoMasonry = ({ photos, loading = false }: PhotoMasonryProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading photos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">📷</span>
        <p className="mt-4 text-gray-600">No photos yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Uniform Grid - All tiles same size */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedPhotoIndex(index)}
          >
            <div className="relative overflow-hidden bg-gray-200 rounded-lg h-64">
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                <div className="w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.description && (
                    <p className="text-gray-200 text-xs">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </>
  );
};
