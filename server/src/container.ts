import { prisma } from './lib/prisma';
import { PrismaPhotoRepository } from './repositories/prisma/PrismaPhotoRepository';
import { PrismaAlbumRepository } from './repositories/prisma/PrismaAlbumRepository';
import { PrismaBlogRepository } from './repositories/prisma/PrismaBlogRepository';
import { PrismaPostRepository } from './repositories/prisma/PrismaPostRepository';
import { PhotoService } from './services/PhotoService';
import { AlbumService } from './services/AlbumService';
import { BlogService } from './services/BlogService';
import { PostService } from './services/PostService';

export const photoService = new PhotoService(new PrismaPhotoRepository(prisma));
export const albumService = new AlbumService(new PrismaAlbumRepository(prisma));
export const blogService  = new BlogService(new PrismaBlogRepository(prisma));
export const postService  = new PostService(new PrismaPostRepository(prisma));
