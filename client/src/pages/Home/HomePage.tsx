import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {t('home.title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {t('home.subtitle')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/gallery"
            className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {t('home.viewGallery')}
          </a>
          <a
            href="/photo-walks"
            className="text-base font-semibold leading-7 text-gray-900 hover:text-primary-600"
          >
            {t('home.explorePhotoWalks')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Recent Posts Section - Placeholder */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('home.recentPosts')}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for posts - will be populated with actual data */}
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            <p>{t('home.noPostsYet')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
