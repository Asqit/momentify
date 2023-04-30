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
import { useGetPostQuery, useLikePostMutation } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { FaRegComment } from 'react-icons/fa';
import { useAppSelector } from '~/hooks';
import { FormEvent, useEffect, useState } from 'react';
import { PostWithReferences } from '~/setup/features/posts/posts.types';
import { useCreateCommentMutation } from '~/setup/features/comments/comments.api';

interface PostProps {}

export function Post(props: PostProps) {
	const state = useParams();
	const navigate = useNavigate();
	const { id: postId } = state;
	const { id: userId } = useAppSelector((st) => st.auth.user!);
	const [likePost] = useLikePostMutation();
	const [postComment] = useCreateCommentMutation();
	const [postDetails, setPostDetails] = useState<PostWithReferences | null>(null);
	const [commentValue, setCommentValue] = useState<string>('');

	if (!postId || !userId) {
		toast.error('Failed to fetch post');
		navigate('..');
	}

	const { data, isLoading, isError } = useGetPostQuery(postId!); // RKT-Query query

	useEffect(() => {
		if (data) {
			setPostDetails(data);
		}
	}, [data]);

	const handleLike = async () => {
		try {
			if (!postDetails) {
				toast.error('id is invalid');
				return;
			}

			let newLikedBy = postDetails.likedBy.includes(userId)
				? postDetails.likedBy.filter((id) => id !== userId)
				: [...postDetails.likedBy, userId];

			setPostDetails({
				...postDetails,
				likedBy: newLikedBy,
			});

			const data = await likePost({
				userId: userId,
				id: postDetails.id,
			}).unwrap();

			setPostDetails({
				...postDetails,
				...data,
			});
		} catch (error) {
			toast.error(String(error));

			if (postDetails) {
				let newLikedBy = postDetails.likedBy.filter((id) => id !== userId);

				setPostDetails({
					...postDetails,
					likedBy: newLikedBy,
				});
			}
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (!data) {
				return;
			}

			if (!postDetails) {
				setPostDetails(data);
			}

			const comment = await postComment({
				postId: postId!,
				authorId: userId,
				value: commentValue,
			}).unwrap();

			setPostDetails({
				...postDetails!,
				comments: [...postDetails!.comments, comment],
			});
		} catch (error) {
			toast.error('Failed to post a comment');
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
						<InlineProfile
							id={data.authorId}
							username={data.author.username}
							profilePicture={data?.author.profilePicture}
						/>
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
									onClickCallback={function (): void {
										throw new Error('Function not implemented.');
									}}
								/>
							)}
						</figure>
						<div className="flex gap-x-3 my-4">
							<div className="flex items-center gap-x-2">
								<HeartButton
									isLiked={data.likedBy.includes(userId)}
									onClick={handleLike}
									likes={postDetails ? postDetails.likedBy.length : data.likedBy.length}
								/>
							</div>
							<span className="flex items-center text-lg gap-x-2">
								<FaRegComment /> {data.comments.length}
							</span>
						</div>
						<p>
							<span className="font-bold capitalize">{data.author.username}: </span>
							{data.title}
						</p>
						<hr className="dark:border-gray-800 my-4" />
						<ul className="my-4">
							{postDetails ? (
								postDetails.comments.length === 0 ? (
									<li className="my-4">
										<span>Be first one to post a comment</span>
									</li>
								) : (
									postDetails.comments.map((details) => (
										<Comment
											userId={details.authorId}
											value={details.value}
											key={details.id}
										/>
									))
								)
							) : null}
						</ul>
						<form className="flex w-full" onSubmit={handleSubmit}>
							<Textfield
								parentClassName="flex-grow rounded-r-none"
								label="Your comment"
								placeholder="e.g. Nice photos"
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
