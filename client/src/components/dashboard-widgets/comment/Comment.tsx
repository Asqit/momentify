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
				<li className="flex items-center gap-x-2 my-8">
					<figure className="inline-block w-[32px] aspect-square rounded-full bg-gray-200 animate-pulse" />
					<span
						className={`inline-block w-[96px] h-[16px] bg-gray-200 animate-pulse rounded-md`}
					/>
				</li>
			</li>
		);
	}

	return (
		<li>
			<div className="inline-block">
				<img
					crossOrigin="anonymous"
					className={
						'w-full max-h-[500px] aspect-square object-cover rounded-md cursor-pointer dark:brightness-75'
					}
					src={
						data?.profilePicture
							? `http://localhost:8080/${data.profilePicture}`
							: sampleUser
					}
					alt=""
					loading="eager"
				/>
			</div>
			<p>{value}</p>
		</li>
	);
}
