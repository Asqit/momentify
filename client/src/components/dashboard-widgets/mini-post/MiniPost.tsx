import { User } from '~/setup/features/auth/auth.types';
import { FaRegComment, FaRegHeart, FaHeart } from 'react-icons/fa';
import { Slideshow } from '~/components';
import { Link } from 'react-router-dom';
import { useLikePostMutation } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import sampleUser from '~/assets/images/sample_user.png';
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

	return (
		<div className="w-fit h-fit p-2">
			<div className="mb-2">
				{Array.isArray(details.body) && details.body.length > 1 ? (
					<MemoizedSlideshow
						images={details.body.map((filename) => `http://localhost:8080/${filename}`)}
					/>
				) : (
					<img
						crossOrigin="anonymous"
						className={'max-w-[500px] aspect-square object-cover rounded-md'}
						src={`http://localhost:8080/${details.body}`}
						alt={''}
						loading="lazy"
					/>
				)}
			</div>
			<div className="mt-4 flex items-center justify-between px-4">
				<Link to={`account/${details.author.id}`} className={'flex gap-x-4 items-center'}>
					<img
						src={
							details.author.profilePicture
								? `http://localhost:8080/${details.author.profilePicture}`
								: sampleUser
						}
						alt={'User photo'}
						className="rounded-full aspect-square outline-dashed outline-2 outline-offset-2 outline-sky-500"
						crossOrigin="anonymous"
						loading="lazy"
						width={32}
					/>
					<b className="capitalize">{details.author.username}</b>
				</Link>
				<div className="flex gap-x-3">
					<button onClick={handleLike} className="flex items-center text-lg gap-x-2">
						{details.likedBy && details.likedBy.includes(userId) ? (
							<FaHeart className="text-red-500" />
						) : (
							<FaRegHeart />
						)}{' '}
						{details.likedBy ? details.likedBy.length : 0}
					</button>
					<span className="flex items-center text-lg gap-x-2">
						<FaRegComment /> {0}
					</span>
				</div>
			</div>
		</div>
	);
}

function MemoizedSlideshow({ images }: { images: string[] }) {
	const memoizedSlideshow = useMemo(() => {
		return <Slideshow images={images} />;
	}, [images]);

	return memoizedSlideshow;
}
