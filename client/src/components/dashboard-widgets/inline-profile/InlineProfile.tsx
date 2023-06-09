import { Link } from 'react-router-dom';
import sampleUser from '~/assets/images/sample_user.png';

interface InlineProfileProps {
	id: string;
	profilePicture?: string | null;
	username: string;
}

export function InlineProfile(props: InlineProfileProps) {
	const { id, profilePicture, username } = props;

	return (
		<Link to={`/account/${id}`} className={'flex gap-x-4 items-center dark:text-gray-200'}>
			<img
				src={profilePicture ? `http://localhost:8080/${profilePicture}` : sampleUser}
				alt={'User photo'}
				className="rounded-full aspect-square outline-dashed outline-1 outline-offset-2 outline-sky-500"
				crossOrigin="anonymous"
				loading="lazy"
				width={32}
			/>
			<b className="capitalize">{username}</b>
		</Link>
	);
}
