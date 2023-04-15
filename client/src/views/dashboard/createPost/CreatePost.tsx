import { Button, Textfield } from '~/components';
import { CreatePostForm } from './CreatePostForm';

export function CreatePost() {
	const handleSubmit = () => {};

	return (
		<section className={'h-full w-full'}>
			<main className={'container mx-auto min-w-[90%] h-full flex justify-center gap-x-4'}>
				<article>
					<div className={'my-4'}>
						<h1 className={'mb-2 font-semibold text-xl'}>Create a post</h1>
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
