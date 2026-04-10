import { Router } from 'express';
import type { PhotoService } from '../services/PhotoService';

export function photosRouter(photoService: PhotoService): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    const photos = await photoService.getAllWithAssignments();
    res.json(photos);
  });

  router.get('/:id', async (req, res) => {
    const photo = await photoService.getByIdWithAssignments(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    res.json(photo);
  });

  router.put('/:id/assignments', async (req, res) => {
    const { categoryIds, albumIds } = req.body;
    if (!Array.isArray(categoryIds) || !Array.isArray(albumIds)) {
      return res.status(400).json({ error: 'categoryIds and albumIds must be arrays' });
    }
    await photoService.updateAssignments(req.params.id, { categoryIds, albumIds });
    res.json({ ok: true });
  });

  return router;
}
