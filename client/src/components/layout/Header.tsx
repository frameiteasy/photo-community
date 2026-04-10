import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !scrolled;

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.gallery'), href: '/gallery' },
    { name: t('navigation.albums'), href: '/albums' },
    { name: t('navigation.blog'), href: '/blog' },
    { name: t('navigation.messages'), href: '/posts' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  transparent ? 'text-white' : 'text-primary-600'
                }`}
              >
                {t('common.appName')}
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-300 ${
                      transparent
                        ? isActive
                          ? 'border-white text-white'
                          : 'border-transparent text-white/80 hover:text-white hover:border-white/50'
                        : isActive
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
            <button className="rounded-full p-1">
              <span className="sr-only">{t('navigation.profile')}</span>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  transparent
                    ? 'bg-white/20 text-white'
                    : 'bg-primary-100 text-primary-600'
                }`}
              >
                <span className="text-sm font-medium">U</span>
              </div>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
