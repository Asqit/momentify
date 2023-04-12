import { Button, Textfield } from '~/components';

export function CreatePost() {
	const handleSubmit = () => {};

	return (
		<section>
			<main>
				<h1>Create a new post</h1>
				<form onSubmit={handleSubmit}>
					<input type="text" />
					<input type="file" />
					<button type="submit">create</button>
				</form>
			</main>
		</section>
	);
}
