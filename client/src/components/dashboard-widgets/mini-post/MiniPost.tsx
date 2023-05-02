import { User } from '~/setup/features/auth/auth.types';
import { FaRegComment } from 'react-icons/fa';
import { HeartButton, InlineProfile, LazyImage, Slideshow } from '~/components';
import { useNavigate } from 'react-router-dom';
import { useLikePostMutation } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import { useAppSelector } from '~/hooks';
import { Comment } from '~/setup/features/comments/comments.types';

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
	const [likePost, {}] = useLikePostMutation();
	const { id: userId } = useAppSelector((st) => st.auth.user!);
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
		navigate(`/post/${id}`);
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
		</div>
	);
}

interface MemoizedSlideshowProps {
	images: string[];
	callback: () => void;
}

function MemoizedSlideshow(props: MemoizedSlideshowProps) {
	const { images, callback } = props;

	const memoizedSlideshow = useMemo(() => {
		return <Slideshow images={images} onClickCallback={callback} />;
	}, [images]);

	return memoizedSlideshow;
}
