import userPhoto from '~/assets/images/sample_user.png';
import { useChangeProfilePictureMutation } from '~/setup/features/users/users.api';
import { User } from '~/setup/features/auth/auth.types';
import { Post } from '~/setup/features/posts/post.types';
import { DragAndDrop } from '~/components';
import { toast } from 'react-toastify';
import { useAppDispatch } from '~/hooks';
import { updateUser } from '~/setup/features/auth/auth.slice';

type MiniProfileProps = {
	id: string;
	username: string;
	email: string;
	posts: Post[];
	following: User[];
	followers: User[];
	profilePicture?: string;
};

/** This is a simple view of User account, it's not including posts, just User photo, amount of: followers, following and posts */
export function MiniProfile(props: MiniProfileProps) {
	const { id, username, posts, following, followers, profilePicture } = props;
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
					'mx-auto h-[100px] w-[100px] rounded-full border my-4 outline-dashed outline-2 outline-offset-2 outline-sky-500 cursor-pointer relative group'
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
