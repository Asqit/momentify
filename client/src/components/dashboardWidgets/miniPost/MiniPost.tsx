import { IUser } from '~/setup/features/auth/auth.types';

import { FaRegComment, FaRegHeart } from 'react-icons/fa';

interface MiniPostProps {
	title: string;
	likes: number;
	author: IUser;
	/** The first image from the images array */
	body: string;
	createdAt: Date;
}

/** This is a small post view. (Will be used inside of grid) */
export function MiniPost(props: MiniPostProps) {
	const { title, likes, author, body, createdAt } = props;

	return (
		<div className="min-w-fit max-w-[256px] border p-2 rounded-md">
			<div className="mb-2">
				<img
					className="rounded-md object-cover max-w-xs"
					crossOrigin="anonymous"
					src={`http://localhost:8080/${body.split('/')[1]}`}
				/>
			</div>
			<div className="mt-2 flex items-center justify-between">
				<div>
					<b className="capitalize">{author.username}</b>
				</div>
				<div className="flex gap-x-3">
					<span className="flex items-center text-lg gap-x-2">
						<FaRegHeart /> {likes ? likes : 0}
					</span>
					<span className="flex items-center text-lg gap-x-2">
						<FaRegComment /> {0}
					</span>
				</div>
			</div>
		</div>
	);
}
