import { useNavigate, useParams } from 'react-router-dom';
import {
	HeartButton,
	InlineProfile,
	PostSkeleton,
	Slideshow,
	Comment,
	Button,
	Textfield,
	DotMenu,
} from '~/components';
import {
	useDeletePostMutation,
	useGetPostQuery,
	useLikePostMutation,
} from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { FaRegComment } from 'react-icons/fa';
import { useAppSelector, useGetRelativeTime } from '~/hooks';
import { FormEvent, ReactNode, useState, useEffect } from 'react';
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
			navigate('..');
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
					<article className="w-full h-full p-4 dark:text-gray-200 overflow-y-auto dark:bg-gray-950 relative">
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
											<Button
												buttonColor="danger"
												className="hover:animate-shake-once p-1 w-full"
												onClick={handleDeletePost}
											>
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
										'h-full aspect-square object-cover rounded-md dark:brightness-75'
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
						<div className="flex justify-between items-center my-4">
							<div className="flex gap-x-3">
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
							{useGetRelativeTime(Date.now(), new Date(data.createdAt).getTime())}
						</div>
						<p>
							<span className="font-bold capitalize">{data.author.username}: </span>
							{data.title}
						</p>
						<hr className="dark:border-gray-800 my-4" />
						<ul className="my-4">
							{data.comments.length === 0 ? (
								<li className="my-4">
									<span>Be first one to post a comment</span>
								</li>
							) : (
								data.comments.map((details) => <Comment {...details} />)
							)}
						</ul>
						<form
							className="flex w-[calc(100%+16px)] sticky -bottom-4 right-0 z-10 bg-white dark:bg-slate-950 p-4"
							onSubmit={handleSubmit}
						>
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
					</article>
				)}
			</main>
		</section>
	);
}
