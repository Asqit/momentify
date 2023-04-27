import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface HeartButtonProps {
	isLiked: boolean;
	onClick: () => void;
	likes: number;
}

export function HeartButton(props: HeartButtonProps) {
	const { isLiked, onClick, likes } = props;
	const [like, setLike] = useState<boolean>(isLiked);

	return (
		<button
			onClick={() => {
				setLike((prev) => !prev);
				onClick();
			}}
			className={`flex items-center text-lg gap-x-2 ${
				like ? 'animate-ping-once' : 'animate-none'
			}`}
		>
			{like ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
			<span>{likes}</span>
		</button>
	);
}
