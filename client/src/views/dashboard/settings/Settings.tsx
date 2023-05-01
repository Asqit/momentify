import { ReactNode } from 'react';
import { Button, LanguageSwitcher, ToggleSwitch } from '~/components';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from 'usehooks-ts';

export function Settings() {
	const { t } = useTranslation();
	const { toggle, isDarkMode } = useDarkMode();

	return (
		<section className="w-full h-full">
			<div className="container max-w-2xl mx-auto h-full p-4 dark:text-gray-200">
				<h1 className="text-xl md:text-3xl font-bold">{t('settings_section.title')}</h1>
				<hr className="dark:border-gray-800 my-4" />
				<ul>
					<ListOption label={t('settings_section.language')}>
						<LanguageSwitcher />
					</ListOption>
					<ListOption label={t('settings_section.theme')}>
						<ToggleSwitch callback={toggle} isEnabled={isDarkMode} />
					</ListOption>
					<ListOption label={t('settings_section.password')}>
						<></>
					</ListOption>
					<ListOption label={t('settings_section.verify_email')}>
						<></>
					</ListOption>
				</ul>
				<div className="border border-red-500 dark:border-red-700 rounded-md p-2">
					<h3 className="font-bold text-lg md:text-xl">
						{t('settings_section.danger_zone')}
					</h3>
					<ul>
						<ListOption label={t('settings_section.delete_account')}>
							<Button buttonColor="danger">{t('settings_section.delete_account')}</Button>
						</ListOption>
					</ul>
				</div>
			</div>
		</section>
	);
}

interface ListOptionProps {
	children: ReactNode;
	label: string;
}

function ListOption(props: ListOptionProps) {
	const { children, label } = props;

	return (
		<li className="w-full rounded-md my-4 bg-gray-200 dark:bg-gray-800 flex items-center justify-between p-2">
			<span>{label}</span>
			{children}
		</li>
	);
}
