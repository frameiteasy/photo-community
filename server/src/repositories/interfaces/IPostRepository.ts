import type { Post, Comment, ReactionType } from '../../types';

export interface IPostRepository {
  getAll(viewerId?: string): Promise<Post[]>;
  getById(id: string, viewerId?: string): Promise<Post | null>;
  addReaction(postId: string, userId: string, emoji: ReactionType): Promise<void>;
  removeReaction(postId: string, userId: string): Promise<void>;
  addComment(postId: string, userId: string, content: string): Promise<Comment>;
}
