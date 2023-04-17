import { User } from '~/setup/features/auth/auth.types';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { Slideshow } from '~/components';
import sampleUser from "~/assets/images/sample_user.png";

interface MiniPostProps {
	title: string;
	likes: number;
	author: User;
	/** The first image from the images array */
	body: string[] | string;
	createdAt: Date;
}

/** This is a small post view. (Will be used inside of grid) */
export function MiniPost(props: MiniPostProps) {
	const { likes, author, body, ...rest } = props;

	return (
		<div className="min-w-fit max-w-[256px] p-2 border border-transparent rounded-md transition-colors hover:border-gray-200">
			<div className="mb-2">
				{Array.isArray(body) && body.length > 1 ? (
					<Slideshow images={body.map((filename) => `http://localhost:8080/${filename}`)} />
				) : (
					<img
						crossOrigin="anonymous"
						className={'max-w-[500px] h-[400px] object-cover rounded-md'}
						src={`http://localhost:8080/${body}`}
						alt={''}
					/>
				)}
			</div>
			<div className="mt-2 flex items-center justify-between px-2">
				<div className={"flex gap-x-2 items-center"}>
					<img src={author.profilePicture ? author.profilePicture : sampleUser} alt={"User photo"} width={32} />
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
