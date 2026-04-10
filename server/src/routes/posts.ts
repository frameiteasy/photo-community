import { Router } from 'express';
import type { PostService } from '../services/PostService';
import { resolveViewer } from '../middleware/viewer';
import type { ReactionType } from '../types';

const VALID_REACTIONS = new Set(['love', 'wow', 'fire', 'clap', 'haha']);

export function postsRouter(postService: PostService): Router {
  const router = Router();

  router.use(resolveViewer);

  router.get('/', async (req, res) => {
    const posts = await postService.getAll(req.viewerId);
    res.json(posts);
  });

  router.get('/:id', async (req, res) => {
    const post = await postService.getById(req.params.id, req.viewerId);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  });

  router.post('/:id/reactions', async (req, res) => {
    if (!req.viewerId) return res.status(401).json({ error: 'X-Viewer-Id header required' });
    const { emoji } = req.body;
    if (!VALID_REACTIONS.has(emoji)) return res.status(400).json({ error: 'Invalid emoji' });
    await postService.addReaction(req.params.id, req.viewerId, emoji as ReactionType);
    res.json({ ok: true });
  });

  router.delete('/:id/reactions', async (req, res) => {
    if (!req.viewerId) return res.status(401).json({ error: 'X-Viewer-Id header required' });
    await postService.removeReaction(req.params.id, req.viewerId);
    res.json({ ok: true });
  });

  router.post('/:id/comments', async (req, res) => {
    if (!req.viewerId) return res.status(401).json({ error: 'X-Viewer-Id header required' });
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
    const comment = await postService.addComment(req.params.id, req.viewerId, content.trim());
    res.status(201).json(comment);
  });

  return router;
}
