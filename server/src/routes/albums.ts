import { Router } from 'express';
import type { AlbumService } from '../services/AlbumService';

export function albumsRouter(albumService: AlbumService): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    const albums = await albumService.getAlbums();
    res.json(albums);
  });

  router.get('/:slug', async (req, res) => {
    const album = await albumService.getAlbumBySlug(req.params.slug);
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json(album);
  });

  return router;
}
