# Photos Folder

This folder is where you should place your sample photos for the gallery feature.

## Folder Structure

```
photos/
├── landscape/    # Landscape photography
├── portrait/     # Portrait photography
├── street/       # Street photography
└── nature/       # Nature and wildlife photography
```

## Instructions

1. **Add your photos** to the appropriate category folders
2. **Supported formats**: JPG, JPEG, PNG, WebP
3. **Naming convention**: Use descriptive names (e.g., `sunset-mountains.jpg`)
4. **File size**: Keep files under 5MB for optimal performance

## Example

Place a landscape photo in: `public/photos/landscape/my-photo.jpg`

The app will load photos from these folders and display them in the gallery.

## Future Plans

In later phases, we'll replace this local folder approach with:

- Cloud storage integration (Google Photos, AWS S3, etc.)
- Upload interface in the app
- Automatic image optimization
- Metadata extraction (EXIF data)

For now, this simple folder structure lets you start building and testing the gallery UI immediately!
