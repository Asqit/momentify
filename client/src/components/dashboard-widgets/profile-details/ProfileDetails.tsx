import { Button, Modal, Textfield } from '~/components/common';
import { Post } from '~/setup/features/posts/posts.types';
import userPhoto from '~/assets/images/sample_user.png';
import { useAppSelector } from '~/hooks';
import { toast } from 'react-toastify';
import {
	useChangeBioMutation,
	useToggleFollowUserMutation,
} from '~/setup/features/users/users.api';
import { FormEvent, useState } from 'react';
import { ProfilePicture } from '../profile-picture/ProfilePicture';

interface ProfileDetailsProps {
	username: string;
	email: string;
	id: string;
	profilePicture?: string;
	posts: Post[];
	followersIds: string[];
	followingIds: string[];
	bio: string | null;
}

export function ProfileDetails(props: ProfileDetailsProps) {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [bioInput, setBioInput] = useState<string>('');
	const { username, id, profilePicture, posts, followersIds, followingIds, bio } = props;
	const { id: followerId, followingIds: userFollowingIds } = useAppSelector(
		(st) => st.auth.user!,
	);
	const [toggleFollow] = useToggleFollowUserMutation();
	const [changeBio] = useChangeBioMutation();

	const handleFollowToggle = async () => {
		try {
			await toggleFollow({
				userId: id,
				followerId,
			}).unwrap();
		} catch (error) {
			toast.error('Could not update follow');
		}
	};

	const handleChangeBio = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await changeBio({
				id,
				bio: bioInput,
			}).unwrap();
		} catch (error) {
			toast.error('Failed to update bio');
		}
	};

	return (
		<header className="flex flex-wrap justify-center items-center dark:text-gray-200">
			<div className="mr-8">
				{id !== followerId ? (
					<img
						src={profilePicture ? `http://localhost:8080/${profilePicture}` : userPhoto}
						alt="User photography"
						className="object-cover rounded-full w-[200px] h-[200px]"
					/>
				) : (
					<div className="w-[200px]">
						<ProfilePicture userId={id} pictureSource={profilePicture} />
					</div>
				)}
			</div>
			<article className="flex-grow max-w-xs">
				<div className="flex justify-between items-center my-4">
					<h2 className="text-3xl capitalize">{username}</h2>
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
				{bio ? <p>{bio}</p> : null}
				{id == followerId ? (
					<div>
						<button
							className="capitalize underline"
							onClick={() => setIsModalOpen((p) => !p)}
						>
							change
						</button>
					</div>
				) : null}
				<Modal isOpen={isModalOpen} callback={() => setIsModalOpen((p) => !p)}>
					<form onSubmit={handleChangeBio}>
						<Textfield
							onChange={(e) => setBioInput(e.currentTarget.value)}
							value={bioInput}
						/>
						<Button type="submit">change</Button>
					</form>
				</Modal>
			</article>
		</header>
	);
}
