import type { IPostRepository } from '../interfaces/IPostRepository';
import type { Post, Comment, ReactionType } from '../../types';

const POSTS: Post[] = [
  {
    id: '1',
    userReaction: null,
    photoUrl: '/photos/landscape/20251027-KMS07249.jpg',
    description:
      'Poranek nad jeziorem. Wstałem o 4:30, żeby złapać to światło — i chyba było warto 🌄\n\nCzęsto myślę, że najpiękniejsze chwile są zarezerwowane dla tych, którzy są gotowi wstać wcześniej niż słońce. To zdjęcie jest tego dowodem.',
    publishedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    reactions: { love: 14, wow: 6, fire: 9, clap: 3, haha: 0 },
    comments: [
      { id: 'c1', author: 'Anna K.',  avatar: 'AK', content: 'To światło jest absolutnie magiczne ✨ Jak długo czekałeś?', createdAt: new Date(Date.now() - 1.8 * 86_400_000).toISOString() },
      { id: 'c2', author: 'Marek W.', avatar: 'MW', content: 'Niesamowite. To jezioro Śniardwy?',                          createdAt: new Date(Date.now() - 1.5 * 86_400_000).toISOString() },
      { id: 'c3', author: 'Zofia R.', avatar: 'ZR', content: '4:30 😱 Ja bym nie dała rady, ale efekt jest tego wart! 🔥', createdAt: new Date(Date.now() - 1.2 * 86_400_000).toISOString() },
      { id: 'c4', author: 'Piotr N.', avatar: 'PN', content: 'Jedna z najpiękniejszych rzeczy jakie ostatnio widziałem 💯', createdAt: new Date(Date.now() - 0.9 * 86_400_000).toISOString() },
      { id: 'c5', author: 'Ela S.',   avatar: 'ES', content: 'Wydrukujesz? Chętnie bym powiesiła na ścianie 🙏',           createdAt: new Date(Date.now() - 0.5 * 86_400_000).toISOString() },
    ],
  },
  {
    id: '2',
    userReaction: null,
    photoUrl: '/photos/nature/20250721-KMS02711.jpg',
    description:
      'Las po deszczu ma w sobie coś mistycznego. Powietrze pachnie ziemią i żywicą, a każda kropla na liściu wygląda jak mały diament.',
    publishedAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    reactions: { love: 8, wow: 4, fire: 2, clap: 1, haha: 0 },
    comments: [
      { id: 'c6', author: 'Anna K.',  avatar: 'AK', content: 'Uwielbiam te kolory 🌿',               createdAt: new Date(Date.now() - 6.5 * 86_400_000).toISOString() },
      { id: 'c7', author: 'Tomek B.', avatar: 'TB', content: 'Jaki obiektyw użyłeś do tego ujęcia?', createdAt: new Date(Date.now() - 6.0 * 86_400_000).toISOString() },
    ],
  },
  {
    id: '3',
    userReaction: null,
    photoUrl: '/photos/landscape/20220214-_KMS9994.jpg',
    description:
      'Zimowy spacer. Cisza, biel i mróz, który szczypie w twarz — dokładnie tego potrzebowałem po tygodniu przy biurku 📷❄️',
    publishedAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
    reactions: { love: 5, wow: 2, fire: 3, clap: 0, haha: 1 },
    comments: [
      { id: 'c8', author: 'Marek W.', avatar: 'MW', content: 'Tatry?', createdAt: new Date(Date.now() - 13 * 86_400_000).toISOString() },
    ],
  },
];

export class MockPostRepository implements IPostRepository {
  async getAll(_viewerId?: string): Promise<Post[]> { return POSTS; }
  async getById(id: string, _viewerId?: string): Promise<Post | null> { return POSTS.find((p) => p.id === id) ?? null; }
  async addReaction(_postId: string, _userId: string, _emoji: ReactionType): Promise<void> {}
  async removeReaction(_postId: string, _userId: string): Promise<void> {}
  async addComment(_postId: string, _userId: string, content: string): Promise<Comment> {
    return { id: Date.now().toString(), author: 'You', avatar: 'YO', content, createdAt: new Date().toISOString() };
  }
}
