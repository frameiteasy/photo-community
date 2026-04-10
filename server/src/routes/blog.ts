import { Router } from 'express';
import type { BlogService } from '../services/BlogService';

export function blogRouter(blogService: BlogService): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    const posts = await blogService.getAll();
    res.json(posts);
  });

  router.get('/:slug', async (req, res) => {
    const post = await blogService.getBySlug(req.params.slug);
    if (!post) return res.status(404).json({ error: 'Not found' });

    const adjacent = await blogService.getAdjacent(req.params.slug);
    const readingTime = blogService.readingTime(post.blocks);
    res.json({ ...post, adjacent, readingTime });
  });

  return router;
}
