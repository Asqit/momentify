import { useGetUserQuery } from '~/setup/features/users/users.api';
import { InlineProfile } from '../inline-profile/InlineProfile';
import sampleUser from '~/assets/images/sample_user.png';

interface CommentProps {
	userId: string;
	value: string;
}

export function Comment(props: CommentProps) {
	const { userId, value } = props;
	const { data, isLoading } = useGetUserQuery(userId);

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

	return (
		<li className="my-4 flex items-center justify-start flex-wrap gap-x-3 ">
			<InlineProfile
				id={data.id}
				username={data.username}
				profilePicture={data.profilePicture}
			/>
			-<p>{value}</p>
		</li>
	);
}
