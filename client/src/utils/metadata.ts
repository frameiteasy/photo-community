import piexif from 'piexifjs';

export interface PhotoMetadata {
  width?: number;
  height?: number;
  dateTaken?: string;
  camera?: string;
  model?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
}

/**
 * Extract EXIF metadata from an image
 */
export const extractMetadata = async (imageUrl: string): Promise<PhotoMetadata> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Read as string using FileReader
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const binary = e.target?.result as string;
          const exif = piexif.load(binary);
          console.log('🔍 Raw EXIF Data:', exif);

          const metadata: PhotoMetadata = {};

          // Extract common EXIF tags
          if (exif['0th']) {
            const tags = exif['0th'];

            // Camera make
            if (tags[271]) {
              try {
                metadata.camera = String.fromCharCode.apply(
                  null,
                  Array.from(tags[271] as Uint8Array)
                ).replace(/\0/g, '');
              } catch {
                // Skip if error
              }
            }

            // Camera model
            if (tags[272]) {
              try {
                metadata.model = String.fromCharCode.apply(
                  null,
                  Array.from(tags[272] as Uint8Array)
                ).replace(/\0/g, '');
              } catch {
                // Skip if error
              }
            }

            // Image width and height
            if (tags[256]) {
              metadata.width =
                typeof tags[256] === 'number' ? tags[256] : (tags[256] as number[])[0];
            }
            if (tags[257]) {
              metadata.height =
                typeof tags[257] === 'number' ? tags[257] : (tags[257] as number[])[0];
            }

            // DateTime
            if (tags[306]) {
              try {
                metadata.dateTaken = String.fromCharCode.apply(
                  null,
                  Array.from(tags[306] as Uint8Array)
                ).replace(/\0/g, '');
              } catch {
                // Skip if error
              }
            }
          }

          // EXIF IFD data (Exif specific)
          if (exif.Exif) {
            const exifTags = exif.Exif;

            // Focal length
            if (exifTags[37386]) {
              const fl = exifTags[37386] as number[][];
              if (Array.isArray(fl) && fl.length > 0) {
                metadata.focalLength = `${Math.round(fl[0][0] / fl[0][1])}mm`;
              }
            }

            // F-number (aperture)
            if (exifTags[33437]) {
              const fn = exifTags[33437] as number[][];
              if (Array.isArray(fn) && fn.length > 0) {
                metadata.aperture = `f/${(fn[0][0] / fn[0][1]).toFixed(1)}`;
              }
            }

            // ISO
            if (exifTags[34855]) {
              metadata.iso = `ISO ${exifTags[34855]}`;
            }

            // Shutter speed
            if (exifTags[33434]) {
              const ss = exifTags[33434] as number[][];
              if (Array.isArray(ss) && ss.length > 0) {
                const speed = ss[0][0] / ss[0][1];
                if (speed < 1) {
                  metadata.shutterSpeed = `1/${Math.round(1 / speed)}s`;
                } else {
                  metadata.shutterSpeed = `${speed.toFixed(2)}s`;
                }
              }
            }
          }

          resolve(metadata);
        } catch (error) {
          console.error('Error parsing EXIF:', error);
          resolve({});
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
        resolve({});
      };

      reader.readAsBinaryString(blob);
    });
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {};
  }
};

/**
 * Format metadata for display
 */
export const formatMetadata = (metadata: PhotoMetadata): string[] => {
  const items: string[] = [];

  if (metadata.camera && metadata.model) {
    items.push(`📷 ${metadata.camera} ${metadata.model}`);
  } else if (metadata.model) {
    items.push(`📷 ${metadata.model}`);
  }

  if (metadata.dateTaken) {
    items.push(`📅 ${metadata.dateTaken}`);
  }

  if (metadata.focalLength) {
    items.push(`🔍 ${metadata.focalLength}`);
  }

  if (metadata.aperture) {
    items.push(`🔆 ${metadata.aperture}`);
  }

  if (metadata.iso) {
    items.push(`⚡ ${metadata.iso}`);
  }

  if (metadata.shutterSpeed) {
    items.push(`⏱️ ${metadata.shutterSpeed}`);
  }

  if (metadata.width && metadata.height) {
    items.push(`📐 ${metadata.width}×${metadata.height}px`);
  }

  return items;
};
