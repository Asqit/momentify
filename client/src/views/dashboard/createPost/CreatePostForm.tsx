import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Textfield } from '~/components';
import { useCreatePostMutation } from '~/setup/features/posts/posts.api';
import { useAppSelector } from '~/hooks';

export function CreatePostForm() {
	const [files, setFiles] = useState<FileList | null>(null);
	const [previews, setPreviews] = useState<string[] | null>(null);
	const [createPost, { isLoading }] = useCreatePostMutation();
	const [title, setTitle] = useState<string>('');
	const { user } = useAppSelector(state => state.auth);

	const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
		const images: string[] = [];
		const files = e.target.files;

		if (files) {
			const FILES_LENGTH = files.length;

			for (let i = 0; i < FILES_LENGTH; i++) {
				images.push(URL.createObjectURL(files[i]));
			}
		}

		setFiles(files);
		setPreviews(images);
	};

	const handlePostCreation = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const formData = new FormData();

			if (!user) {
				toast.error("Missing user");
				return;
			}

			if (files) {
				for (let i = 0; i < files.length; i++) {
					formData.append('files', files[i]);
				}
			}

			formData.append('title', title);
			formData.append("authorId", user.id);

			await createPost(formData).unwrap();
		} catch (error) {
			toast.error('Failed to create post');
		}
	};

	return (
		<div>
			<form onSubmit={handlePostCreation} encType="multipart/form-data" method="POST">
				<Textfield
					label="Photos"
					type="file"
					multiple
					name="files"
					accept="image/*"
					onChange={handleSelectImages}
				/>
				<Textfield
					label="Title"
					name="title"
					value={title}
					placeholder="e.g. Trip to Paris"
					onChange={(e) => setTitle(e.currentTarget.value)}
				/>
				<Button buttonColor="primary" type="submit">
					create post
				</Button>
			</form>
			<div>
				{previews ? (
					<div>
						{previews.map((preview) => (
							<img src={preview} key={previews.indexOf(preview)} />
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}