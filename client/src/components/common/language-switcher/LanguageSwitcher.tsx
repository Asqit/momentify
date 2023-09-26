import { useTranslation } from 'react-i18next';

const langs = [
	{ emoji: '🇬🇧', id: 0, shortCut: 'en', name: 'English' },
	{ emoji: '🇨🇿', id: 1, shortCut: 'cz', name: 'Čeština' },
];

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	return (
		<select className="inline-flex items-center justify-center gap-x-2 bg-transparent">
			{langs.map((lang) => {
				return (
					<option
						key={lang.id}
						className="disabled:opacity-50"
						onClick={() => i18n.changeLanguage(lang.shortCut)}
					>
						{lang.emoji}
					</option>
				);
			})}
		</select>
	);
}
