import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pl' : 'en';
    i18n.changeLanguage(newLang);
  };

  const nextLanguage = i18n.language === 'en' ? 'pl' : 'en';

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-md bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 hover:bg-primary-200 transition-colors"
      title={`Switch to ${nextLanguage === 'en' ? 'English' : 'Polish'}`}
    >
      {nextLanguage.toUpperCase()}
    </button>
  );
};
