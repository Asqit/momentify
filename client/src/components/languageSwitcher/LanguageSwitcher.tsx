import { useTranslation } from 'react-i18next';

const langs = [
  { emoji: '🇬🇧', id: 0, shortCut: 'en', name: 'English' },
  { emoji: '🇨🇿', id: 1, shortCut: 'cz', name: 'Čeština' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className='flex items-center justify-center gap-x-6'>
      {langs.map((lang) => {
        return (
          <button
            type='submit'
            key={lang.id}
            disabled={i18n.resolvedLanguage === lang.shortCut}
            onClick={() => i18n.changeLanguage(lang.shortCut)}
          >
            {lang.name}
          </button>
        );
      })}
    </div>
  );
}
