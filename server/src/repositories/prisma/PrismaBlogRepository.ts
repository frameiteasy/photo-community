import type { PrismaClient } from '../../generated/prisma/client';
import type { IBlogRepository } from '../interfaces/IBlogRepository';
import type { BlogPost, BlogPostSummary, ContentBlock } from '../../types';

function toSummary(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  publishedAt: Date;
}): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverPhotoUrl: row.coverPhotoUrl,
    publishedAt: row.publishedAt.toISOString(),
  };
}

export class PrismaBlogRepository implements IBlogRepository {
  constructor(private readonly db: PrismaClient) {}

  async getAll(): Promise<BlogPostSummary[]> {
    const rows = await this.db.blogPost.findMany({
      select: { id: true, slug: true, title: true, excerpt: true, coverPhotoUrl: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map(toSummary);
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const row = await this.db.blogPost.findUnique({ where: { slug } });
    if (!row) return null;
    return {
      ...toSummary(row),
      blocks: row.content as ContentBlock[],
    };
  }

  async getAdjacent(slug: string): Promise<{ prev: BlogPostSummary | null; next: BlogPostSummary | null }> {
    const current = await this.db.blogPost.findUnique({
      where: { slug },
      select: { publishedAt: true },
    });
    if (!current) return { prev: null, next: null };

    const [prevRow, nextRow] = await Promise.all([
      this.db.blogPost.findFirst({
        where: { publishedAt: { lt: current.publishedAt } },
        orderBy: { publishedAt: 'desc' },
        select: { id: true, slug: true, title: true, excerpt: true, coverPhotoUrl: true, publishedAt: true },
      }),
      this.db.blogPost.findFirst({
        where: { publishedAt: { gt: current.publishedAt } },
        orderBy: { publishedAt: 'asc' },
        select: { id: true, slug: true, title: true, excerpt: true, coverPhotoUrl: true, publishedAt: true },
      }),
    ]);

    return {
      prev: prevRow ? toSummary(prevRow) : null,
      next: nextRow ? toSummary(nextRow) : null,
    };
  }
}
