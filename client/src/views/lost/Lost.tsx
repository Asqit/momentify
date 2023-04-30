import aliens from '~/assets/images/lost_illustration.svg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components';

export function Lost() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<section className="w-full h-screen max-h-full dark:text-gray-200">
			<div className="container h-full p-4 mx-auto grid grid-cols-2 items-center justify-center">
				<figure className="hidden md:block max-w-md">
					<img src={aliens} alt="Cartoon alien illustration" />
				</figure>
				<article>
					<h1 className="text-3xl md:text-5xl font-black mb-4">
						{t('lost_section.title')}
					</h1>
					<h2 className="text-gray-400 font-semibold text-lg mb-4">
						{t('lost_section.subtitle')}
					</h2>
					<p className="mb-4">{t('lost_section.details')}</p>
					<Button buttonColor="primary" onClick={() => navigate(-1)}>
						{t('lost_section.go_back')}
					</Button>
				</article>
			</div>
		</section>
	);
}
