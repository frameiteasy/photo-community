import type { BlogPost, BlogPostSummary } from '../../types';

export interface IBlogRepository {
  getAll(): Promise<BlogPostSummary[]>;
  getBySlug(slug: string): Promise<BlogPost | null>;
  getAdjacent(slug: string): Promise<{ prev: BlogPostSummary | null; next: BlogPostSummary | null }>;
}
