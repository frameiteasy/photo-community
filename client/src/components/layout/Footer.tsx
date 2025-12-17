import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {currentYear} {t('common.appName')}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
