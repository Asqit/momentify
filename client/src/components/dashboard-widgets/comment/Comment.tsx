import { useGetUserQuery } from '~/setup/features/users/users.api';
import { InlineProfile } from '../inline-profile/InlineProfile';
import { Comment } from '~/setup/features/comments/comments.types';
import { HeartButton } from '../heart-button/HeartButton';
import { useAppSelector, useGetRelativeTime } from '~/hooks';
import {
	useDeleteCommentMutation,
	useLikeCommentMutation,
	useUpdateCommentMutation,
} from '~/setup/features/comments/comments.api';
import { useState } from 'react';
import { Button } from '~/components/common';
import { toast } from 'react-toastify';

type CommentProps = {} & Comment;

export function Comment(props: CommentProps) {
	const { authorId, value, likedBy, id, createdAt, updatedAt } = props;
	const { user } = useAppSelector((st) => st.auth);
	const { data, isLoading } = useGetUserQuery(authorId);
	const [likeComment] = useLikeCommentMutation();
	const [deleteComment] = useDeleteCommentMutation();
	const time = useGetRelativeTime(
		Date.now(),
		new Date(updatedAt ? updatedAt : createdAt).getTime(),
	);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editValue, setEditValue] = useState<string>(value);
	const [updateComment] = useUpdateCommentMutation();

	const handleLike = async () => {
		try {
			if (!user) {
				return;
			}

			await likeComment({
				id,
				userId: user.id,
			}).unwrap();
		} catch (error) {}
	};

	const handleUpdate = async () => {
		setIsEditing(false);
		try {
			await updateComment({
				id,
				value: editValue,
			}).unwrap();
		} catch (error) {
			toast.error('Failed to update comment');
		}
	};

	const handleDelete = async () => {
		try {
			await deleteComment(id).unwrap();
		} catch (error) {
			toast.error('Failed to delete comment');
		}
	};

	if (isLoading) {
		return (
			<li>
				<div className="flex items-center gap-x-2 my-8">
					<figure className="inline-block w-[32px] aspect-square rounded-full bg-gray-200 animate-pulse" />
					<span
						className={`inline-block w-[96px] h-[16px] bg-gray-200 animate-pulse rounded-md`}
					/>
				</div>
			</li>
		);
	}

	if (!data) {
		return null;
	}

	if (!user) {
		return null;
	}

	return (
		<li className="my-4">
			<div className="flex my-2 items-center justify-start gap-x-2">
				<InlineProfile
					id={data.id}
					username={data.username}
					profilePicture={data.profilePicture}
				/>
				<p>{time}</p>
			</div>
			<div className="pl-2 border-l dark:border-slate-800">
				{isEditing ? (
					<input
						type="text"
						value={editValue}
						className="w-full rounded-sm p-1 outline outline-sky-500"
						onChange={(e) => setEditValue(e.currentTarget.value)}
					/>
				) : (
					<p>{value}</p>
				)}
				<div className="flex gap-x-2 items-center">
					<HeartButton
						isLiked={likedBy.includes(user.id)}
						onClick={handleLike}
						likes={likedBy.length}
					/>
					{user && user.id === authorId ? (
						<>
							{isEditing ? (
								<Button className="py-0 px-1" buttonColor="primary" onClick={handleUpdate}>
									submit
								</Button>
							) : (
								<Button className="py-0 px-1" onClick={() => setIsEditing((prev) => !prev)}>
									edit
								</Button>
							)}
							<Button className="py-0 px-1" buttonColor="danger" onClick={handleDelete}>
								delete
							</Button>
						</>
					) : null}
				</div>
			</div>
		</li>
	);
}
