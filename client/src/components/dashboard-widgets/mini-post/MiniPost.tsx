import { User } from '~/setup/features/auth/auth.types';
import { FaRegComment } from 'react-icons/fa';
import { HeartButton, InlineProfile, Slideshow } from '~/components';
import { useNavigate } from 'react-router-dom';
import { useLikePostMutation } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import { useAppSelector } from '~/hooks';

interface MiniPostProps {
	title: string;
	likedBy: string[];
	author: User;
	body: string[] | string;
	createdAt: Date;
	id: string;
	onClickCallback?: () => void;
}

/** This is a small post view. (Will be used inside of grid) */
export function MiniPost(props: MiniPostProps) {
	const [details, setDetails] = useState<MiniPostProps>(props);
	const [likePost, {}] = useLikePostMutation();
	const { id: userId } = useAppSelector((st) => st.auth.user!);
	const navigate = useNavigate();

	const handleLike = async () => {
		try {
			if (!details.id) {
				toast.error('id is invalid');
				return;
			}

			let newLikedBy = details.likedBy.includes(userId)
				? details.likedBy.filter((id) => id !== userId)
				: [...details.likedBy, userId];

			setDetails({
				...details,
				likedBy: newLikedBy,
			});

			const data = await likePost({
				userId: userId,
				id: details.id,
			}).unwrap();

			setDetails({
				...details,
				...data,
			});
		} catch (error) {
			toast.error(String(error));

			let newLikedBy = details.likedBy.filter((id) => id !== userId);

			setDetails({
				...details,
				likedBy: newLikedBy,
			});
		}
	};

	const navigateToPost = () => {
		navigate(`/post/${details.id}`);
	};

	return (
		<div className="w-fit h-fit p-2 pb-3 border border-transparent  hover:border-gray-200 dark:text-gray-200 dark:hover:border-gray-800 transition-colors rounded-xl">
			<div className="mb-2">
				{Array.isArray(details.body) && details.body.length > 1 ? (
					<MemoizedSlideshow
						callback={navigateToPost}
						images={details.body.map((filename) => `http://localhost:8080/${filename}`)}
					/>
				) : (
					<img
						crossOrigin="anonymous"
						className={'max-w-[500px] aspect-square object-cover rounded-md'}
						src={`http://localhost:8080/${details.body}`}
						alt=""
						onClick={navigateToPost}
						loading="eager"
					/>
				)}
			</div>
			<div className="mt-4 flex items-center justify-between px-4">
				<InlineProfile {...details.author} />
				<div className="flex gap-x-3">
					<HeartButton
						onClick={handleLike}
						likes={details.likedBy.length}
						isLiked={details.likedBy.includes(userId)}
					/>
					<span className="flex items-center text-lg gap-x-2">
						<FaRegComment /> <span>{0}</span>
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
