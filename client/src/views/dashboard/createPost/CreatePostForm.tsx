import { ChangeEvent, FormEvent, useState, DragEvent } from 'react';
import { toast } from 'react-toastify';
import { Button, DragAndDrop, Slideshow } from '~/components';
import { useCreatePostMutation } from '~/setup/features/posts/posts.api';
import { useAppSelector } from '~/hooks';

export function CreatePostForm() {
	const [files, setFiles] = useState<FileList | null>(null);
	const [previews, setPreviews] = useState<string[] | null>(null);
	const [createPost, { isLoading }] = useCreatePostMutation();
	const [title, setTitle] = useState<string>('');
	const { user } = useAppSelector((state) => state.auth);

	const handlePostCreation = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const formData = new FormData();

			if (!user) {
				toast.error('Missing user');
				return;
			}

			if (!title) {
				toast.error('Missing title');
				return;
			}

			if (!files) {
				toast.error('Missing files');
				return;
			}

			for (let i = 0; i < files.length; i++) {
				formData.append('files', files[i]);
			}

			formData.append('title', title);
			formData.append('authorId', user.id);

			await createPost(formData).unwrap();
		} catch (error) {
			toast.error('Failed to create post');
		}
	};

	const handleFileDrop = (files: FileList) => {
		const images: string[] = [];

		if (files) {
			const FILES_LENGTH = files.length;

			for (let i = 0; i < FILES_LENGTH; i++) {
				images.push(URL.createObjectURL(files[i]));
			}
		}

		setFiles(files);
		setPreviews(images);
	};

	return (
		<div>
			<form
				onSubmit={handlePostCreation}
				encType="multipart/form-data"
				method="POST"
				className={'flex flex-col mx-auto w-[400px] gap-4'}
			>
				<input
					name="title"
					value={title}
					placeholder="Title"
					className={'input'}
					onChange={(e) => setTitle(e.currentTarget.value)}
				/>
				<DragAndDrop
					onFileDrop={handleFileDrop}
					className={
						'border border-dashed h-[100px] flex flex-col items-center justify-center rounded-sm cursor-pointer'
					}
				>
					<p>Drag and drop images or click</p>
				</DragAndDrop>
				<hr />
				<Button buttonColor="primary" type="submit" disabled={!title || !files}>
					create post
				</Button>
			</form>
			<div className="mt-4">{previews ? <Slideshow images={previews} /> : null}</div>
		</div>
	);
}
