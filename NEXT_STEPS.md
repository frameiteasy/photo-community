# Next Steps: Gallery Implementation

## Current Status: ✅ Foundation Complete

The React app is fully set up with:

- All dependencies installed
- Folder structure created
- Routing configured
- Layout components working
- TypeScript types defined
- Photo folders ready (`public/photos/`)

## Next Task: Build the Gallery Feature

### Step 1: Photo Scanner Service

**File:** `src/services/photoService.ts`

Currently, the service returns empty arrays. We need to implement:

```typescript
// Option 1: Manual photo list (simple, for now)
const PHOTOS = [
  {
    id: "1",
    url: "/photos/landscape/photo1.jpg",
    thumbnailUrl: "/photos/landscape/photo1.jpg",
    title: "Mountain Sunset",
    category: "landscape",
  },
  // Add more as you add photos to folders
];

// Option 2: Dynamic import (requires bundler config)
// We'll implement this if needed

// Option 3: API call to server (later phase)
// Replace with actual API when server is ready
```

### Step 2: Photo Grid Component

**File:** `src/components/gallery/PhotoGrid.tsx`

Create a responsive grid that displays photos:

```tsx
interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export const PhotoGrid = ({ photos, onPhotoClick }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} onClick={() => onPhotoClick(photo)}>
          <img src={photo.thumbnailUrl} alt={photo.title} />
        </div>
      ))}
    </div>
  );
};
```

### Step 3: Category Detail Page

**File:** `src/pages/Gallery/CategoryPage.tsx`

Show all photos for a specific category:

```tsx
export const CategoryPage = () => {
  const { category } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Load photos for this category
  // Display in PhotoGrid
  // Handle photo click to open viewer
};
```

### Step 4: Photo Viewer (Lightbox)

**File:** `src/components/gallery/PhotoViewer.tsx`

Full-screen photo viewer with navigation:

Features needed:

- ✅ Full-screen overlay (dark background)
- ✅ Large photo display
- ✅ Previous/Next buttons
- ✅ Keyboard navigation (arrows, ESC)
- ✅ Close button
- ✅ Photo counter (e.g., "5 / 24")
- ✅ Optional: Photo metadata sidebar

```tsx
interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PhotoViewer = ({ ... }: PhotoViewerProps) => {
  // Keyboard event listeners
  // Swipe gestures for mobile
  // Display current photo
  // Navigation controls
};
```

### Step 5: Update Routes

**File:** `src/App.tsx`

Add category route:

```tsx
<Route path="/gallery/:category" element={<CategoryPage />} />
```

## Implementation Order

1. ✅ **Add sample photos** to `public/photos/` folders
2. ✅ **Update photoService** with manual photo list
3. ✅ **Create PhotoGrid component** - basic grid layout
4. ✅ **Create CategoryPage** - displays grid for category
5. ✅ **Update Gallery routes** - link categories to pages
6. ✅ **Create PhotoViewer component** - full-screen viewer
7. ✅ **Add keyboard navigation** - arrow keys, ESC
8. ✅ **Add transitions** - smooth animations
9. ✅ **Optimize loading** - lazy loading, image optimization

## After Gallery is Working

### Migrate to Remote Photos

Replace local loading with:

- **Google Photos API** integration
- **Server API** calls (when server is built)
- **Upload functionality**
- **Cloud storage** (AWS S3, Cloudflare R2)

### Example API Integration

```typescript
// src/services/photoService.ts
export const getPhotosByCategory = async (
  category: string
): Promise<Photo[]> => {
  const response = await apiClient.get(
    `/gallery/categories/${category}/photos`
  );
  return response.data;
};
```

## Testing Checklist

- [ ] Photos display in category cards on gallery page
- [ ] Clicking category opens category page with photo grid
- [ ] Clicking photo opens full-screen viewer
- [ ] Arrow keys navigate between photos
- [ ] ESC key closes viewer
- [ ] Photo counter updates correctly
- [ ] Close button works
- [ ] Responsive on mobile devices
- [ ] Images load efficiently

## Questions to Consider

1. **Photo aspect ratios** - Fixed grid or masonry layout?
2. **Image quality** - Show full resolution or optimized versions?
3. **Navigation style** - Minimal overlay or visible controls?
4. **Metadata display** - Show EXIF data? Location? Date?
5. **Transitions** - Fade, slide, or zoom animations?

## Tips for Local Development

1. **Use smaller images** for testing (resize to 2000px width max)
2. **Organize by category** in proper folders
3. **Use consistent naming** (lowercase, hyphens)
4. **Test with different aspect ratios** (landscape, portrait, square)

---

Ready to start implementing? Let me know which component you want to build first! 🚀
