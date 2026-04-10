import type { IPostRepository } from '../repositories/interfaces/IPostRepository';
import type { Post, Comment, ReactionType } from '../types';

export class PostService {
  constructor(private repo: IPostRepository) {}

  getAll(viewerId?: string): Promise<Post[]> {
    return this.repo.getAll(viewerId);
  }

  getById(id: string, viewerId?: string): Promise<Post | null> {
    return this.repo.getById(id, viewerId);
  }

  addReaction(postId: string, userId: string, emoji: ReactionType): Promise<void> {
    return this.repo.addReaction(postId, userId, emoji);
  }

  removeReaction(postId: string, userId: string): Promise<void> {
    return this.repo.removeReaction(postId, userId);
  }

  addComment(postId: string, userId: string, content: string): Promise<Comment> {
    return this.repo.addComment(postId, userId, content);
  }
}
