import { Router } from 'express';
import type { PhotoService } from '../services/PhotoService';

export function galleryRouter(photoService: PhotoService): Router {
  const router = Router();

  router.get('/categories', async (_req, res) => {
    const categories = await photoService.getCategories();
    res.json(categories);
  });

  router.get('/categories/:slug/photos', async (req, res) => {
    const photos = await photoService.getPhotosByCategory(req.params.slug);
    res.json(photos);
  });

  router.get('/recent', async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const photos = await photoService.getRecent(limit);
    res.json(photos);
  });

  return router;
}
