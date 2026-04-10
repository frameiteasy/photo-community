import type { prisma } from '../../lib/prisma';
import type { IPostRepository } from '../interfaces/IPostRepository';
import type { Post, Comment, ReactionType } from '../../types';

type PrismaClient = typeof prisma;

const REACTION_TYPES: ReactionType[] = ['love', 'wow', 'fire', 'clap', 'haha'];

function initReactions(): Record<ReactionType, number> {
  return { love: 0, wow: 0, fire: 0, clap: 0, haha: 0 };
}

function avatarFromName(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

type PostRow = Awaited<ReturnType<PrismaClient['post']['findMany']>>[number] & {
  reactions: Array<{ userId: string; emoji: string }>;
  comments: Array<{
    id: string;
    body: string;
    createdAt: Date;
    author: { name: string };
  }>;
};

function toPost(row: PostRow, viewerId?: string): Post {
  const reactions = initReactions();
  for (const r of row.reactions) {
    if (REACTION_TYPES.includes(r.emoji as ReactionType)) {
      reactions[r.emoji as ReactionType]++;
    }
  }
  const userReaction =
    viewerId
      ? (row.reactions.find((r) => r.userId === viewerId)?.emoji as ReactionType | undefined) ?? null
      : null;

  return {
    id: row.id,
    photoUrl: row.photoUrl ?? '',
    description: row.description,
    publishedAt: row.createdAt.toISOString(),
    reactions,
    userReaction,
    comments: row.comments.map((c) => ({
      id: c.id,
      author: c.author.name,
      avatar: avatarFromName(c.author.name),
      content: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}

const postInclude = {
  reactions: { select: { userId: true, emoji: true } },
  comments: {
    where: { parentId: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'asc' as const },
  },
};

export class PrismaPostRepository implements IPostRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(viewerId?: string): Promise<Post[]> {
    const rows = await this.prisma.post.findMany({
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => toPost(r as PostRow, viewerId));
  }

  async getById(id: string, viewerId?: string): Promise<Post | null> {
    const row = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!row) return null;
    return toPost(row as PostRow, viewerId);
  }

  async addReaction(postId: string, userId: string, emoji: ReactionType): Promise<void> {
    // Upsert: if user already reacted to this post, replace the emoji
    const existing = await this.prisma.reaction.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existing) {
      await this.prisma.reaction.update({
        where: { userId_postId: { userId, postId } },
        data: { emoji },
      });
    } else {
      await this.prisma.reaction.create({ data: { userId, postId, emoji } });
    }
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    await this.prisma.reaction.deleteMany({ where: { userId, postId } });
  }

  async addComment(postId: string, userId: string, content: string): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: { authorId: userId, postId, body: content },
      include: { author: { select: { name: true } } },
    });
    return {
      id: comment.id,
      author: comment.author.name,
      avatar: avatarFromName(comment.author.name),
      content: comment.body,
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
