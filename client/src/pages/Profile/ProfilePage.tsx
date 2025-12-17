import { useTranslation } from 'react-i18next';

export const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500">{t('profile.featureComingSoon')}</p>
      </div>
    </div>
  );
};
