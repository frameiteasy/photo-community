// Photo and Gallery Types
export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  category: PhotoCategory;
  captureDate?: string;
  location?: string;
  camera?: string;
  lens?: string;
  settings?: PhotoSettings;
}

export interface PhotoSettings {
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  focalLength?: string;
}

export type PhotoCategory = 'landscape' | 'portrait' | 'street' | 'nature' | 'other';

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverPhotoUrl?: string;
  photoCount: number;
}

// Photo Walk Types
export interface PhotoWalk {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate?: string;
  destination: string;
  coverPhotoUrl?: string;
  photos: Photo[];
  createdAt: string;
}

// Social Feed Types
export interface Post {
  id: string;
  userId: string;
  author: User;
  photoUrl: string;
  thumbnailUrl: string;
  description: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  userReaction?: 'like' | 'dislike' | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  content: string;
  parentCommentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type ReactionType = 'like' | 'dislike';

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'photographer' | 'friend';
  createdAt: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  userId: string;
  author: User;
  photoWalkId?: string;
  title: string;
  slug: string;
  content: string;
  coverPhotoUrl?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Messaging Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
