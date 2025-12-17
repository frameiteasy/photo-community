import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.gallery'), href: '/gallery' },
    { name: t('navigation.photoWalks'), href: '/photo-walks' },
    { name: t('navigation.blog'), href: '/blog' },
    { name: t('navigation.messages'), href: '/messages' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">{t('common.appName')}</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
              <span className="sr-only">{t('navigation.profile')}</span>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">U</span>
              </div>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
