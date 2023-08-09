import { toast } from 'react-toastify';
import { DragAndDrop } from '~/components/common';
import { useAppDispatch } from '~/hooks';
import { updateUser } from '~/setup/features/auth/auth.slice';
import { useChangeProfilePictureMutation } from '~/setup/features/users/users.api';
import userPhoto from '~/assets/images/sample_user.png';

interface ProfilePictureProps {
	userId: string;
	pictureSource?: string;
}

export function ProfilePicture(props: ProfilePictureProps) {
	const { userId, pictureSource } = props;
	const [changeProfilePicture, { isLoading, isError }] = useChangeProfilePictureMutation();
	const dispatch = useAppDispatch();

	const handleFileDrop = async (files: FileList) => {
		try {
			const fd = new FormData();

			fd.append('file', files[0]);

			const updatedUser = await changeProfilePicture({
				data: fd,
				id: userId,
			}).unwrap();

			dispatch(updateUser(updatedUser));
		} catch (error) {
			toast.error('Profile picture could not be updated');
		}
	};

	return (
		<DragAndDrop
			onFileDrop={handleFileDrop}
			className={
				'mx-auto rounded-full border my-4 mb-5 outline-dashed outline-2 outline-offset-2 outline-sky-500 cursor-pointer relative group'
			}
		>
			<img
				src={pictureSource ? `/${pictureSource}` : userPhoto}
				alt="User photography"
				className="object-cover rounded-full w-full aspect-square bg-white dark:bg-slate-800"
			/>
			<span className="hidden group-hover:block absolute top-full left-0 w-full bg-black rounded-md text-white text-center">
				change
			</span>
		</DragAndDrop>
	);
}
