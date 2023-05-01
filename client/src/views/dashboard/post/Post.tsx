import { useNavigate, useParams } from 'react-router-dom';
import {
	HeartButton,
	InlineProfile,
	PostSkeleton,
	Slideshow,
	Comment,
	Button,
	Textfield,
} from '~/components';
import {
	useDeletePostMutation,
	useGetPostQuery,
	useLikePostMutation,
} from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { FaRegComment } from 'react-icons/fa';
import { useAppSelector } from '~/hooks';
import { FormEvent, ReactNode, useState } from 'react';
import { useCreateCommentMutation } from '~/setup/features/comments/comments.api';

interface PostProps {}

export function Post(props: PostProps) {
	const state = useParams();
	const navigate = useNavigate();
	const { id: postId } = state;
	const { id: userId } = useAppSelector((st) => st.auth.user!);
	const [likePost] = useLikePostMutation();
	const [postComment] = useCreateCommentMutation();
	const [deletePost] = useDeletePostMutation();
	const [commentValue, setCommentValue] = useState<string>('');

	if (!postId || !userId) {
		toast.error('Failed to fetch post');
		navigate('..');
	}

	const { data, isLoading, isError } = useGetPostQuery(postId!);

	const handleLike = async () => {
		try {
			if (!data) {
				return;
			}

			await likePost({
				userId: userId,
				id: data?.id,
			}).unwrap();
		} catch (error) {
			toast.error(String(error));
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.currentTarget.reset();

		try {
			if (!data) {
				return;
			}

			await postComment({
				postId: postId!,
				authorId: userId,
				value: commentValue,
			}).unwrap();
		} catch (error) {
			toast.error('Failed to post a comment');
		}
	};

	const handleDeletePost = async () => {
		try {
			await deletePost(postId!).unwrap();
			toast.info('Post has been successfully deleted');
		} catch (error) {
			toast.error('Failed to delete post');
		}
	};

	// Rendering --------------------------------------------------------------------------------------------------->
	if (isLoading) {
		return <PostSkeleton />;
	}

	if (isError || !data) {
		toast.error('Failed to fetch post');

		return (
			<section className="w-full h-full flex items-center justify-center flex-col dark:text-gray-200">
				<h1 className="text-xl md:text-3xl mb-2">Post cannot be loaded</h1>
				<p>An uncaught error occurred and post could'nt be fetched</p>
			</section>
		);
	}

	return (
		<section className="w-full h-full py-2">
			<main className="container h-full mx-auto max-w-2xl overflow-y-auto border rounded-md dark:border-gray-800">
				{isLoading ? (
					<PostSkeleton />
				) : (
					<article className="w-full h-full p-4 dark:text-gray-200 overflow-y-auto dark:bg-gray-950">
						<div className="flex justify-between">
							<InlineProfile
								id={data.authorId}
								username={data.author.username}
								profilePicture={data?.author.profilePicture}
							/>
							{data.authorId === userId ? (
								<DotMenu>
									<ul className="w-[120px] flex flex-col gap-2">
										<li>
											<Button buttonColor="danger" onClick={handleDeletePost}>
												delete post
											</Button>
										</li>
									</ul>
								</DotMenu>
							) : null}
						</div>
						<figure className="my-4">
							{data.body.length === 1 ? (
								<img
									crossOrigin="anonymous"
									className={
										'w-full max-h-[500px] aspect-square object-cover rounded-md dark:brightness-75'
									}
									src={`http://localhost:8080/${data.body[0]}`}
									alt=""
									loading="eager"
								/>
							) : (
								<Slideshow
									images={data.body.map((filename) => `http://localhost:8080/${filename}`)}
								/>
							)}
						</figure>
						<div className="flex gap-x-3 my-4">
							<div className="flex items-center gap-x-2">
								<HeartButton
									isLiked={data.likedBy.includes(userId)}
									onClick={handleLike}
									likes={data.likedBy.length}
								/>
							</div>
							<a href="#comment">
								<span className="flex items-center text-lg gap-x-2">
									<FaRegComment /> {data.comments.length}
								</span>
							</a>
						</div>
						<p>
							<span className="font-bold capitalize">{data.author.username}: </span>
							{data.title}
						</p>
						<details>
							<summary>view more</summary>
							<hr className="dark:border-gray-800 my-4" />
							<ul className="my-4">
								{data.comments.length === 0 ? (
									<li className="my-4">
										<span>Be first one to post a comment</span>
									</li>
								) : (
									data.comments.map((details) => (
										<Comment
											userId={details.authorId}
											value={details.value}
											key={details.id}
										/>
									))
								)}
							</ul>
							<form className="flex w-full" onSubmit={handleSubmit}>
								<Textfield
									id="comment"
									parentClassName="flex-grow rounded-r-none"
									label="Your comment"
									placeholder="e.g. Nice photos"
									value={commentValue}
									onChange={(e) => setCommentValue(e.currentTarget.value)}
								/>
								<Button
									disabled={!commentValue}
									className="rounded-l-none"
									type="submit"
									buttonColor="primary"
								>
									post
								</Button>
							</form>
						</details>
					</article>
				)}
			</main>
		</section>
	);
}

interface DotMenuProps {
	isOpen?: boolean;
	children: ReactNode;
}

function DotMenu(props: DotMenuProps) {
	const { isOpen, children } = props;
	const [isActive, setIsActive] = useState<boolean>(isOpen ?? false);

	return (
		<div className="relative">
			<button
				className={`group ${!isActive ? 'hover:animate-pulse' : 'hover:animate-none'}`}
				onClick={() => setIsActive((prev) => !prev)}
			>
				<div
					className={`inline-block transition-all w-[8px] h-[8px] ${
						isActive ? 'mx-0' : 'mx-[2px]'
					} rounded-full bg-sky-500`}
				/>
				<div
					className={`inline-block transition-all w-[8px] h-[8px] ${
						isActive ? 'mx-0' : 'mx-[2px]'
					} rounded-full bg-sky-500`}
				/>
				<div
					className={`inline-block transition-all w-[8px] h-[8px] ${
						isActive ? 'mx-0' : 'mx-[2px]'
					} rounded-full bg-sky-500`}
				/>
			</button>
			<div
				className={`${
					isActive ? 'block' : 'hidden'
				} animate-ping-once absolute top-full right-0 z-20 w-fit h-fit p-2 rounded-md shadow-md bg-white dark:bg-gray-800`}
			>
				{children}
			</div>
		</div>
	);
}
