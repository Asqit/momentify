import userPhoto from '~/assets/images/sample_user.png';
import { useChangeProfilePictureMutation } from '~/setup/features/users/users.api';
import { User } from '~/setup/features/auth/auth.types';
import { Post } from '~/setup/features/posts/posts.types';
import { DragAndDrop } from '~/components';
import { toast } from 'react-toastify';
import { useAppDispatch } from '~/hooks';
import { updateUser } from '~/setup/features/auth/auth.slice';

type MiniProfileProps = {
	id: string;
	username: string;
	email: string;
	posts: Post[];
	followingIds: string[];
	followersIds: string[];
	profilePicture?: string;
};

/** This is a simple view of User account, it's not including posts, just User photo, amount of: followers, following and posts */
export function MiniProfile(props: MiniProfileProps) {
	const { id, username, posts, followingIds, followersIds, profilePicture } = props;
	const [changeProfilePicture] = useChangeProfilePictureMutation();
	const dispatch = useAppDispatch();

	const handleFileDrop = async (files: FileList) => {
		try {
			const fd = new FormData();

			fd.append('file', files[0]);

			const updatedUser = await changeProfilePicture({
				data: fd,
				id,
			}).unwrap();

			dispatch(updateUser(updatedUser));
		} catch (error) {
			toast.error('Profile picture could not be updated');
		}
	};

	return (
		<div className="w-full">
			<DragAndDrop
				onFileDrop={handleFileDrop}
				className={
					'mx-auto h-[100px] w-[100px] rounded-full border my-4 mb-5 outline-dashed outline-2 outline-offset-2 outline-sky-500 cursor-pointer relative group'
				}
			>
				<img
					src={profilePicture ? `http://localhost:8080/${profilePicture}` : userPhoto}
					alt="User photography"
					crossOrigin="anonymous"
					className="object-cover rounded-full w-[100px] h-[100px]"
				/>
				<span className="hidden group-hover:block absolute top-full left-0 w-full bg-black rounded-md text-white text-center">
					change
				</span>
			</DragAndDrop>

			<h4 className="font-semibold text-lg text-center my-3 capitalize">{username}</h4>
			<div className="grid grid-cols-3 divide-x">
				<p className="p-1 text-center">
					<span className="text-black font-medium">{posts.length}</span>
					<br />
					<span className="text-gray-400 font-medium text-sm">Posts</span>
				</p>
				<p className="p-1 text-center">
					<span className="text-black font-medium">{followingIds.length}</span>
					<br />
					<span className="text-gray-400 font-medium text-sm">Following</span>
				</p>
				<p className="p-1 text-center">
					<span className="text-black font-medium">{followersIds.length}</span>
					<br />
					<span className="text-gray-400 font-medium text-sm">Followers</span>
				</p>
			</div>
		</div>
	);
}
