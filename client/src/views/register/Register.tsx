import { Link } from 'react-router-dom';
import { AuthNav } from '~/components';
import { RegisterForm } from './components/RegisterForm';
import { useTranslation } from 'react-i18next';

export function Register() {
	const { t } = useTranslation();

	return (
		<section className="w-full">
			<div className="h-screen lg:grid lg:grid-cols-2">
				<figure className="hidden lg:block bg-gradient-to-bl to-black  from-sky-500"></figure>

				<main className="w-full h-full flex flex-col dark:bg-gray-950 dark:text-gray-200">
					<AuthNav />
					<article className="flex-grow flex flex-col justify-center items-center">
						<div className="max-w-5xl w-full md:w-[90%] p-4">
							<h1 className="text-3xl md:text-5xl font-black mb-4">
								{t('register_section.title')}
								<span className="inline-block ml-1 w-1 h-1 md:w-2 md:h-2 bg-sky-500 rounded-full" />
							</h1>
							<h4 className="text-gray-400 font-semibold text-lg mb-8">
								{t('register_section.subtitle')}{' '}
								<Link className="link" to="/login">
									{t('register_section.subtitle_link')}
								</Link>
							</h4>
							<RegisterForm />
						</div>
					</article>
				</main>
			</div>
		</section>
	);
}
