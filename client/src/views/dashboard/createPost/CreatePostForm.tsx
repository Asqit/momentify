import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Spinner, Textfield } from '~/components';
import { useCreatePostMutation } from '~/setup/features/posts/posts.api';

export function CreatePostForm() {
	const [files, setFiles] = useState<FileList | null>(null);
	const [previews, setPreviews] = useState<string[] | null>(null);
	const [createPost, { isLoading }] = useCreatePostMutation();
	const [title, setTitle] = useState<string>('');

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
			formData.append('title', title);

			if (files) {
				for (let i = 0; i < files.length; i++) {
					formData.append('files', files[i]);
				}
			}

			await createPost({ files: formData, title: title }).unwrap();
		} catch (error) {
			toast.error('Failed to create post');
		}
	};

	return (
		<div className="w-full h-full">
			{isLoading ? (
				<Spinner />
			) : (
				<>
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
					<div className="w-full">
						{previews ? (
							<div className="flex gap-2 flex-wrap">
								{previews.map((preview) => (
									<img
										className="max-w-sm rounded-md object-cover"
										src={preview}
										key={previews.indexOf(preview)}
									/>
								))}
							</div>
						) : null}
					</div>
				</>
			)}
		</div>
	);
}
