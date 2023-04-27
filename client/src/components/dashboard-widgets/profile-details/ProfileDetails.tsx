import { Button } from '~/components/common';
import { Post } from '~/setup/features/posts/posts.types';
import userPhoto from '~/assets/images/sample_user.png';
import { useAppSelector } from '~/hooks';
import { toast } from 'react-toastify';
import { useToggleFollowUserMutation } from '~/setup/features/users/users.api';

interface ProfileDetailsProps {
	username: string;
	email: string;
	id: string;
	profilePicture: string;
	posts: Post[];
	followersIds: string[];
	followingIds: string[];
}

export function ProfileDetails(props: ProfileDetailsProps) {
	const { username, id, email, profilePicture, posts, followersIds, followingIds } = props;
	const { id: followerId, followingIds: userFollowingIds } = useAppSelector(
		(st) => st.auth.user!,
	);
	const [toggleFollow, {}] = useToggleFollowUserMutation();

	const handleFollowToggle = async () => {
		try {
			const result = await toggleFollow({
				userId: id,
				followerId,
			}).unwrap();
		} catch (error) {
			toast.error('Could not update follow');
		}
	};

	return (
		<header className="flex justify-center items-center dark:text-gray-200">
			<div className="mr-8">
				<img
					src={profilePicture ? `http://localhost:8080/${profilePicture}` : userPhoto}
					alt="User photography"
					crossOrigin="anonymous"
					className="object-cover rounded-full aspect-square w-[200px]"
				/>
			</div>
			<article className="flex-grow max-w-xs">
				<div className="flex justify-between items-center my-4">
					<h2 className="text-3xl">{username}</h2>
					<Button className="py-2 inline-block" onClick={handleFollowToggle}>
						{userFollowingIds.includes(id) ? 'unfollow' : 'follow'}
					</Button>
				</div>
				<div className="grid grid-cols-3">
					<p>
						{posts.length} <span className={'text-gray-400 font-medium'}>posts</span>
					</p>
					<p>
						{followersIds.length}{' '}
						<span className={'text-gray-400 font-medium'}>followers</span>
					</p>
					<p>
						{followingIds.length}{' '}
						<span className={'text-gray-400 font-medium'}>following</span>
					</p>
				</div>
			</article>
		</header>
	);
}
