import userPhoto from '~/assets/images/sample_user.png';
import { User } from '~/setup/features/auth/auth.types';
import { Post } from '~/setup/features/posts/post.types';
import { DragAndDrop } from '~/components';

type MiniProfileProps = {
	username: string;
	email: string;
	posts: Post[];
	following: User[];
	followers: User[];
	profilePicture?: string;
};

/** This is a simple view of User account, it's not including posts, just User photo, amount of: followers, following and posts */
export function MiniProfile(props: MiniProfileProps) {
	const { username, email, posts, following, followers, profilePicture } = props;

		const handleFileDrop = (files:FileList) => {

		}

	return (
		<div className="w-full">
			<div className="mx-auto min-h-[100px] w-[100px] rounded-full border my-4 outline-dashed outline-2 outline-offset-2 outline-sky-500 relative group">
				<img
					src={profilePicture ? profilePicture : userPhoto}
					alt="User photography"
					className="object-cover rounded-full w-[100px] h-[100px]"
				/>
				<DragAndDrop onFileDrop={handleFileDrop} className={"absolute w-full -bottom-1 left-0 bg-black/50 text-white backdrop-blur-sm text-center rounded-b-full cursor-pointer hidden group-hover:block"}>
					<span>change</span>
				</DragAndDrop>
			</div>
			<h4 className="font-semibold text-lg text-center my-2 capitalize">{username}</h4>
			<div className="flex gap-x-2 justify-center items-center text-center">
				<p>
					<span className="text-black font-medium">{posts.length}</span>
					<br />
					<span className="text-gray-400 font-medium">Posts</span>
				</p>
				<p>
					<span className="text-black font-medium">{following.length}</span>
					<br />
					<span className="text-gray-400 font-medium">Following</span>
				</p>
				<p>
					<span className="text-black font-medium">{followers.length}</span>
					<br />
					<span className="text-gray-400 font-medium">Followers</span>
				</p>
			</div>
		</div>
	);
}
