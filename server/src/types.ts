// ─── Gallery ─────────────────────────────────────────────────────────────────

export type PhotoCategory = 'landscape' | 'portrait' | 'street' | 'nature' | 'other';

export interface Album {
  id: string;
  slug: string;
  name: string;
  description?: string;
  location?: string;
  date?: string;
  photoCount: number;
  coverPhotoUrl?: string;
}

export interface AlbumDetail extends Album {
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  category: PhotoCategory;
  captureDate?: string;
  camera?: string;
  lens?: string;
}

export interface PhotoAssignment {
  id: string;
  slug: string;
  name: string;
}

export interface PhotoWithAssignments extends Photo {
  categories: PhotoAssignment[];
  albums: PhotoAssignment[];
}

export interface UpdateAssignmentsInput {
  categoryIds: string[];
  albumIds: string[];
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverPhotoUrl?: string;
  photoCount: number;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'photo'; url: string; caption?: string }
  | { type: 'photos'; urls: string[]; layout: 'grid' | 'strip' };

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  publishedAt: string;
}

export interface BlogPost extends BlogPostSummary {
  blocks: ContentBlock[];
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export type ReactionType = 'love' | 'wow' | 'fire' | 'clap' | 'haha';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  photoUrl: string;
  description: string;
  publishedAt: string;
  reactions: Record<ReactionType, number>;
  userReaction: ReactionType | null;
  comments: Comment[];
}
