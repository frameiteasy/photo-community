import { apiClient } from './api';

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
  readingTime: number;
  adjacent: {
    prev: BlogPostSummary | null;
    next: BlogPostSummary | null;
  };
}

export const getBlogPosts = async (): Promise<BlogPostSummary[]> => {
  const { data } = await apiClient.get<BlogPostSummary[]>('/v1/blog');
  return data;
};

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const { data } = await apiClient.get<BlogPost>(`/v1/blog/${slug}`);
  return data;
};
