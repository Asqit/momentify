import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Button, DragAndDrop, Slideshow, Spinner, Textfield } from '~/components';
import { useCreatePostMutation } from '~/setup/features/posts/posts.api';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { logout } from '~/setup/features/auth/auth.slice';

export function CreatePostForm() {
	const [files, setFiles] = useState<FileList | null>(null);
	const [previews, setPreviews] = useState<string[] | null>(null);
	const [createPost, { isLoading }] = useCreatePostMutation();
	const [title, setTitle] = useState<string>('');
	const { user } = useAppSelector((state) => state.auth);
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const handlePostCreation = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const formData = new FormData();

			if (!user) {
				toast.error('Missing user');
				dispatch(logout());
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
			{isLoading ? (
				<Spinner />
			) : (
				<form
					onSubmit={handlePostCreation}
					encType="multipart/form-data"
					method="POST"
					className={'flex flex-col mx-auto w-[400px] gap-4'}
				>
					<Textfield
						name="title"
						value={title}
						placeholder={String(t('create_post_section.post_title'))}
						className={'input'}
						onChange={(e) => setTitle(e.currentTarget.value)}
					/>

					{previews ? (
						<>
							<Slideshow images={previews} onClickCallback={() => {}} />
							<Button buttonColor="danger" type="button" onClick={() => setPreviews(null)}>
								{t('create_post_section.delete')}
							</Button>
						</>
					) : (
						<DragAndDrop
							onFileDrop={handleFileDrop}
							className={
								'bg-gray-200 dark:bg-gray-600 dark:border-gray-700 border-2 text-gray-400 border-gray-400 border-dashed h-[100px] flex flex-col items-center justify-center rounded-sm cursor-pointer'
							}
						>
							<p>{t('create_post_section.drag_and_drop')}</p>
						</DragAndDrop>
					)}

					<hr className="dark:border-gray-800" />
					<Button buttonColor="primary" type="submit" disabled={!title || !files}>
						{t('create_post_section.submit')}
					</Button>
				</form>
			)}
		</div>
	);
}
