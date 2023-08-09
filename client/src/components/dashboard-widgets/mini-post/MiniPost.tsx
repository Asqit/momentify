import { User } from '~/setup/features/auth/auth.types';
import { FaRegComment } from 'react-icons/fa';
import { HeartButton, InlineProfile, LazyImage, MemoizedSlideshow } from '~/components';
import { useNavigate } from 'react-router-dom';
import { useLikePostMutation } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
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
}

/** This is a small post view. (Will be used inside of grid) */
export function MiniPost(props: MiniPostProps) {
	const { likedBy, body, author, id, comments } = props;
	const [likePost] = useLikePostMutation();
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
		<article className="w-fit p-2 pb-3 border border-transparent dark:bg-gray-950  hover:border-gray-200 dark:text-gray-200 dark:hover:border-gray-800 transition-colors rounded-xl">
			<figure className="max-w-[500px]">
				{Array.isArray(body) && body.length > 1 ? (
					<MemoizedSlideshow
						callback={navigateToPost}
						images={body.map((filename) => `/api/${filename}`)}
					/>
				) : (
					<LazyImage
						className={'object-cover rounded-md cursor-pointer'}
						src={`/api/${body}`}
						alt=""
						onClick={navigateToPost}
						loading="eager"
					/>
				)}
			</figure>
			<header className="mt-4 flex items-center justify-between px-4">
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
			</header>
		</article>
	);
}
