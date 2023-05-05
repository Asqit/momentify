import { User } from '~/setup/features/auth/auth.types';
import { FaRegComment } from 'react-icons/fa';
import {
	Button,
	HeartButton,
	InlineProfile,
	LazyImage,
	Modal,
	Slideshow,
	Textfield,
	Comment as CommentComponent,
	DotMenu,
} from '~/components';
import { useNavigate } from 'react-router-dom';
import {
	useDeletePostMutation,
	useLikePostMutation,
} from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { FormEvent, useMemo, useState } from 'react';
import { useAppSelector, useGetRelativeTime } from '~/hooks';
import { Comment } from '~/setup/features/comments/comments.types';
import { useMediaQuery } from 'usehooks-ts';
import { useCreateCommentMutation } from '~/setup/features/comments/comments.api';

interface MiniPostProps {
	title: string;
	likedBy: string[];
	author: User;
	body: string[] | string;
	createdAt: Date;
	id: string;
	comments: Comment[];
	onClickCallback?: () => void;
}

/** This is a small post view. (Will be used inside of grid) */
export function MiniPost(props: MiniPostProps) {
	const { title, likedBy, body, author, createdAt, id, comments, onClickCallback } = props;
	const [likePost] = useLikePostMutation();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [commentValue, setCommentValue] = useState<string>('');
	const { id: userId } = useAppSelector((st) => st.auth.user!);
	const [postComment] = useCreateCommentMutation();
	const [deletePost] = useDeletePostMutation();
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const navigate = useNavigate();

	const handleLike = async () => {
		try {
			if (!id) {
				toast.error('id is invalid');
				return;
			}

			await likePost({
				userId: userId,
				id: id,
			}).unwrap();
		} catch (error) {
			toast.error(String(error));
		}
	};

	const navigateToPost = () => {
		if (!isDesktop) {
			navigate(`/post/${id}`);
			return;
		}

		setIsModalOpen((prev) => !prev);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.currentTarget.reset();

		try {
			await postComment({
				postId: id,
				authorId: userId,
				value: commentValue,
			}).unwrap();
		} catch (error) {
			toast.error('Failed to post a comment');
		}
	};

	const handleDeletePost = async () => {
		try {
			await deletePost(id).unwrap();
			toast.info('Post has been successfully deleted');
			navigate('..');
		} catch (error) {
			toast.error('Failed to delete post');
		}
	};

	return (
		<div className="w-fit h-fit p-2 pb-3 border border-transparent dark:bg-gray-950  hover:border-gray-200 dark:text-gray-200 dark:hover:border-gray-800 transition-colors rounded-xl">
			<div className="mb-2">
				{Array.isArray(body) && body.length > 1 ? (
					<MemoizedSlideshow
						callback={navigateToPost}
						images={body.map((filename) => `http://localhost:8080/${filename}`)}
					/>
				) : (
					<LazyImage
						crossOrigin="anonymous"
						className={
							'max-w-2xl w-full aspect-square object-cover rounded-md cursor-pointer'
						}
						src={`http://localhost:8080/${body}`}
						alt=""
						onClick={navigateToPost}
						loading="eager"
					/>
				)}
			</div>
			<div className="mt-4 flex items-center justify-between px-4">
				<InlineProfile {...author} />
				<div className="flex gap-x-3">
					<HeartButton
						onClick={handleLike}
						likes={likedBy.length}
						isLiked={likedBy.includes(userId)}
					/>
					<span className="flex items-center text-lg gap-x-2">
						<FaRegComment /> <span>{comments ? comments.length : 0}</span>
					</span>
				</div>
			</div>
			<Modal
				isOpen={isModalOpen}
				callback={() => setIsModalOpen((prev) => !prev)}
				className="mt-4 rounded-md max-w-screen-lg w-full"
			>
				<div className="grid grid-cols-2 gap-2">
					<figure className="h-full">
						{Array.isArray(body) && body.length > 1 ? (
							<MemoizedSlideshow
								callback={navigateToPost}
								images={body.map((filename) => `http://localhost:8080/${filename}`)}
							/>
						) : (
							<LazyImage
								crossOrigin="anonymous"
								className={
									'max-w-2xl w-full aspect-square object-cover rounded-md cursor-pointer'
								}
								src={`http://localhost:8080/${body}`}
								alt=""
								onClick={navigateToPost}
								loading="eager"
							/>
						)}
					</figure>
					<article className="flex flex-col">
						<div className="flex justify-between">
							<InlineProfile
								id={author.id}
								username={author.username}
								profilePicture={author.profilePicture}
							/>
							{author.id === userId ? (
								<DotMenu>
									<ul className="w-[120px] flex flex-col gap-2">
										<li>
											<Button className="p-1 w-full mb-2" onClick={() => {}}>
												close
											</Button>
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
						<hr className="my-4" />
						<p>
							<span className="font-bold capitalize">{author.username}: </span>
							{title}
						</p>
						<ul className="my-4 flex-grow">
							{comments.length === 0 ? (
								<li className="my-4">
									<span>Be first one to post a comment</span>
								</li>
							) : (
								comments.map((details) => <CommentComponent {...details} />)
							)}
						</ul>
						<div>
							<div className="flex justify-between items-center my-4">
								<div className="flex gap-x-3">
									<div className="flex items-center gap-x-2">
										<HeartButton
											isLiked={likedBy.includes(userId)}
											onClick={handleLike}
											likes={likedBy.length}
										/>
									</div>
									<a href="#comment">
										<span className="flex items-center text-lg gap-x-2">
											<FaRegComment /> {comments.length}
										</span>
									</a>
								</div>
								{useGetRelativeTime(Date.now(), new Date(createdAt).getTime())}
							</div>
							<form className="flex w-full" onSubmit={handleSubmit}>
								<Textfield
									id="comment"
									parentClassName="flex-grow rounded-r-none"
									placeholder="your comment"
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
						</div>
					</article>
				</div>
			</Modal>
		</div>
	);
}

type MemoizedSlideshowProps = {
	images: string[];
	callback: () => void;
};

function MemoizedSlideshow(props: MemoizedSlideshowProps) {
	const { images, callback } = props;

	const memoizedSlideshow = useMemo(() => {
		return <Slideshow images={images} onClickCallback={callback} />;
	}, [images]);

	return memoizedSlideshow;
}
