import { Link } from 'react-router-dom';
import { AuthNav } from '~/components';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './components/LoginForm';

export function Login() {
	const { t } = useTranslation();

	return (
		<section className="w-full">
			<div className="h-screen lg:grid lg:grid-cols-2">
				<main className="w-full h-full flex flex-col">
					<AuthNav />
					<article className="flex-grow flex flex-col justify-center items-center">
						<div className="max-w-5xl w-full md:w-[90%] p-4">
							<h1 className="text-3xl md:text-5xl font-black mb-4">
								{t('login_section.title')}
								<span className="inline-block ml-1 w-1 h-1 md:w-2 md:h-2 bg-sky-500 rounded-full" />
							</h1>
							<h4 className="text-gray-400 font-semibold text-lg mb-8">
								{t('login_section.subtitle')}{' '}
								<Link className="link" to="/register">
									{t('login_section.subtitle_link')}
								</Link>
							</h4>
							<LoginForm />
						</div>
					</article>
				</main>
				<figure className="hidden lg:block bg-gradient-to-bl to-black  from-sky-500" />
			</div>
		</section>
	);
}
