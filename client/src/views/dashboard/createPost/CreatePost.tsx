import { Button, Textfield } from '~/components';
import { CreatePostForm } from './CreatePostForm';

export function CreatePost() {
	const handleSubmit = () => {};

	return (
		<section>
			<main>
				<h1>Create a new post</h1>
				<CreatePostForm />
			</main>
		</section>
	);
}
