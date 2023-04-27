import { useParams } from 'react-router-dom';
import { Post } from '~/setup/features/posts/posts.types';
import { MiniPost, Spinner, ProfileDetails } from '~/components';
import { useGetUserQuery } from '~/setup/features/users/users.api';

export function Account() {
	const { id } = useParams();
	const { data: user, isLoading } = useGetUserQuery(id!);

	return (
		<section className="w-full h-full">
			{isLoading ? (
				<Spinner />
			) : (
				<div className="px-4">
					<div className="py-8">
						<ProfileDetails {...user} />
					</div>
					<hr className="dark:border-gray-800" />
					<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
						{user && user.posts && user.posts.length > 0
							? user.posts.map((post: Post) => {
									return (
										<MiniPost
											title={post.title}
											author={user}
											body={post.body}
											likedBy={post.likedBy}
											createdAt={post.createdAt}
											key={post.id}
											id={post.id}
										/>
									);
							  })
							: null}
					</div>
				</div>
			)}
		</section>
	);
}
