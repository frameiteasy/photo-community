import type { prisma } from '../../lib/prisma';
import type { IAlbumRepository } from '../interfaces/IAlbumRepository';
import type { Album, AlbumDetail, Photo } from '../../types';

type PrismaClient = typeof prisma;

type AlbumPhotoRow = {
  photo: {
    id: string;
    url: string;
    title: string | null;
    captureDate: Date | null;
    camera: string | null;
    lens: string | null;
    categories: Array<{ category: { slug: string } }>;
  };
};

function toPhoto(row: AlbumPhotoRow): Photo {
  return {
    id: row.photo.id,
    url: row.photo.url,
    thumbnailUrl: row.photo.url,
    title: row.photo.title ?? '',
    category: (row.photo.categories[0]?.category.slug ?? 'other') as Photo['category'],
    captureDate: row.photo.captureDate?.toISOString(),
    camera: row.photo.camera ?? undefined,
    lens: row.photo.lens ?? undefined,
  };
}

export class PrismaAlbumRepository implements IAlbumRepository {
  constructor(private prisma: PrismaClient) {}

  async getAlbums(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany({
      include: {
        photos: {
          include: { photo: { select: { url: true } } },
          orderBy: { order: 'asc' },
          take: 1,
        },
        _count: { select: { photos: true } },
      },
      orderBy: { date: 'desc' },
    });

    return albums.map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      description: a.description ?? undefined,
      location: a.location ?? undefined,
      date: a.date?.toISOString(),
      photoCount: a._count.photos,
      coverPhotoUrl: a.photos[0]?.photo.url,
    }));
  }

  async getAlbumBySlug(slug: string): Promise<AlbumDetail | null> {
    const album = await this.prisma.album.findUnique({
      where: { slug },
      include: {
        photos: {
          include: {
            photo: {
              include: { categories: { include: { category: true } } },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { photos: true } },
      },
    });

    if (!album) return null;

    return {
      id: album.id,
      slug: album.slug,
      name: album.name,
      description: album.description ?? undefined,
      location: album.location ?? undefined,
      date: album.date?.toISOString(),
      photoCount: album._count.photos,
      coverPhotoUrl: album.photos[0]?.photo.url,
      photos: album.photos.map(toPhoto),
    };
  }
}
