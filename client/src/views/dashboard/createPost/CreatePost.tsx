import { CreatePostForm } from './CreatePostForm';
import { useTranslation } from 'react-i18next';

export function CreatePost() {
	const { t } = useTranslation();

	return (
		<section className={'h-full w-full'}>
			<main className={'container mx-auto min-w-[90%] h-full flex justify-center gap-x-4'}>
				<article className="mt-8">
					<div className={'my-4'}>
						<h1 className={'mb-2 font-bold text-xl md:text-3xl'}>
							{t('create_post_section.title')}
						</h1>
						<hr />
					</div>
					<div className={'border rounded-md p-4'}>
						<CreatePostForm />
					</div>
				</article>
			</main>
		</section>
	);
}
