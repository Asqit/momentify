import { useTranslation } from 'react-i18next';
import { Emoji } from '../emoji/Emoji';

const langs = [
  { emoji: '🇬🇧', id: 0, shortCut: 'en', name: 'English' },
  { emoji: '🇨🇿', id: 1, shortCut: 'cz', name: 'Čeština' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select className='flex items-center justify-center gap-x-2 bg-transparent'>
      {langs.map((lang) => {
        return (
          <option
            key={lang.id}
            className='disabled:opacity-50'
            disabled={i18n.resolvedLanguage === lang.shortCut}
            onClick={() => i18n.changeLanguage(lang.shortCut)}
          >
            <Emoji symbol={lang.emoji} label={`language:${lang.name}`} />
            <span>{lang.name}</span>
          </option>
        );
      })}
    </select>
  );
}
