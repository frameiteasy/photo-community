import type { prisma } from '../../lib/prisma';
import type { IPhotoRepository } from '../interfaces/IPhotoRepository';
import type { Photo, GalleryCategory, PhotoWithAssignments, UpdateAssignmentsInput } from '../../types';

type PrismaClient = typeof prisma;

type PhotoRow = {
  id: string;
  url: string;
  title: string | null;
  captureDate: Date | null;
  camera: string | null;
  lens: string | null;
  categories: Array<{ category: { slug: string } }>;
};

function toPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    url: row.url,
    thumbnailUrl: row.url,
    title: row.title ?? '',
    category: (row.categories[0]?.category.slug ?? 'other') as Photo['category'],
    captureDate: row.captureDate?.toISOString(),
    camera: row.camera ?? undefined,
    lens: row.lens ?? undefined,
  };
}

export class PrismaPhotoRepository implements IPhotoRepository {
  constructor(private prisma: PrismaClient) {}

  async getPhotosByCategory(slug: string): Promise<Photo[]> {
    const rows = await this.prisma.photo.findMany({
      where: { categories: { some: { category: { slug } } } },
      include: { categories: { include: { category: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toPhoto);
  }

  async getCategories(): Promise<GalleryCategory[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        photos: {
          include: { photo: { select: { url: true } } },
          orderBy: { photo: { createdAt: 'asc' } },
          take: 1,
        },
        _count: { select: { photos: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return categories.map((cat, i) => ({
      id: String(i + 1),
      slug: cat.slug,
      name: cat.name,
      description: cat.description ?? undefined,
      coverPhotoUrl: cat.photos[0]?.photo.url,
      photoCount: cat._count.photos,
    }));
  }

  async getAllWithAssignments(): Promise<PhotoWithAssignments[]> {
    const rows = await this.prisma.photo.findMany({
      include: {
        categories: { include: { category: true } },
        albums: { include: { album: true }, orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => ({
      ...toPhoto(row),
      categories: row.categories.map((c) => ({ id: c.category.id, slug: c.category.slug, name: c.category.name })),
      albums: row.albums.map((a) => ({ id: a.album.id, slug: a.album.slug, name: a.album.name })),
    }));
  }

  async getByIdWithAssignments(id: string): Promise<PhotoWithAssignments | null> {
    const row = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        albums: { include: { album: true }, orderBy: { order: 'asc' } },
      },
    });
    if (!row) return null;
    return {
      ...toPhoto(row),
      categories: row.categories.map((c) => ({ id: c.category.id, slug: c.category.slug, name: c.category.name })),
      albums: row.albums.map((a) => ({ id: a.album.id, slug: a.album.slug, name: a.album.name })),
    };
  }

  async updateAssignments(id: string, input: UpdateAssignmentsInput): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.photoCategory.deleteMany({ where: { photoId: id } }),
      ...input.categoryIds.map((categoryId) =>
        this.prisma.photoCategory.create({ data: { photoId: id, categoryId } })
      ),
      this.prisma.albumPhoto.deleteMany({ where: { photoId: id } }),
      ...input.albumIds.map((albumId, order) =>
        this.prisma.albumPhoto.create({ data: { photoId: id, albumId, order } })
      ),
    ]);
  }

  async getRecent(limit: number): Promise<Photo[]> {
    const rows = await this.prisma.photo.findMany({
      include: { categories: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map(toPhoto);
  }
}
