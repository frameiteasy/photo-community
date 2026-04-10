import { apiClient } from './api';

export type ReactionType = 'love' | 'wow' | 'fire' | 'clap' | 'haha';

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface PostData {
  id: string;
  photoUrl: string;
  description: string;
  publishedAt: string;
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType | null;
  comments: PostComment[];
}

export const getPosts = async (): Promise<PostData[]> => {
  const { data } = await apiClient.get<PostData[]>('/v1/posts');
  return data;
};

export const getPost = async (id: string): Promise<PostData> => {
  const { data } = await apiClient.get<PostData>(`/v1/posts/${id}`);
  return data;
};

export const addReaction = async (postId: string, emoji: ReactionType): Promise<void> => {
  await apiClient.post(`/v1/posts/${postId}/reactions`, { emoji });
};

export const removeReaction = async (postId: string): Promise<void> => {
  await apiClient.delete(`/v1/posts/${postId}/reactions`);
};

export const addComment = async (postId: string, content: string): Promise<PostComment> => {
  const { data } = await apiClient.post<PostComment>(`/v1/posts/${postId}/comments`, { content });
  return data;
};
