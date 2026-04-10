import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/posts/PostCard';
import { getPosts } from '@/services/postService';

export const PostsPage = () => {
  const { t } = useTranslation();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('posts.title')}</h1>
          <button
            disabled
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white opacity-40 cursor-not-allowed"
            title="Coming soon"
          >
            + {t('posts.newPost')}
          </button>
        </div>

        {/* Feed */}
        {isLoading ? (
          <p className="text-center text-gray-400 py-16">{t('common.loading')}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">{t('posts.noPostsYet')}</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
