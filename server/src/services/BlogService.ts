import type { IBlogRepository } from '../repositories/interfaces/IBlogRepository';
import type { BlogPost, BlogPostSummary, ContentBlock } from '../types';

export class BlogService {
  constructor(private repo: IBlogRepository) {}

  getAll(): Promise<BlogPostSummary[]> {
    return this.repo.getAll();
  }

  getBySlug(slug: string): Promise<BlogPost | null> {
    return this.repo.getBySlug(slug);
  }

  getAdjacent(slug: string): Promise<{ prev: BlogPostSummary | null; next: BlogPostSummary | null }> {
    return this.repo.getAdjacent(slug);
  }

  readingTime(blocks: ContentBlock[]): number {
    const words = blocks
      .filter((b): b is Extract<ContentBlock, { type: 'text' }> => b.type === 'text')
      .reduce((acc, b) => acc + b.content.split(/\s+/).length, 0);
    return Math.max(1, Math.ceil(words / 200));
  }
}
