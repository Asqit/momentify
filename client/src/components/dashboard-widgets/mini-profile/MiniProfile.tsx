import { ProfilePicture } from '~/components';
import { User } from '~/setup/features/auth/auth.types';

type MiniProfileProps = {} & User;

/** This is a simple view of User account, it's not including posts, just User photo, amount of: followers, following and posts */
export function MiniProfile(props: MiniProfileProps) {
	const { id, username, posts, followingIds, followersIds, profilePicture } = props;

	return (
		<div className="w-full">
			<div className="w-[100px] aspect-square mx-auto">
				<ProfilePicture userId={id} pictureSource={profilePicture} />
			</div>
			<h4 className="font-semibold text-lg text-center my-3 capitalize dark:text-gray-200">
				{username}
			</h4>
			<div className="grid grid-cols-3 divide-x dark:divide-gray-800">
				<p className="p-1 text-center">
					<span className="text-black dark:text-white font-medium">{posts.length}</span>
					<br />
					<span className="text-gray-400 font-medium text-sm">Posts</span>
				</p>
				<p className="p-1 text-center">
					<span className="text-black dark:text-white font-medium">
						{followingIds.length}
					</span>
					<br />
					<span className="text-gray-400 font-medium text-sm">Following</span>
				</p>
				<p className="p-1 text-center">
					<span className="text-black dark:text-white font-medium">
						{followersIds.length}
					</span>
					<br />
					<span className="text-gray-400 font-medium text-sm">Followers</span>
				</p>
			</div>
		</div>
	);
}
