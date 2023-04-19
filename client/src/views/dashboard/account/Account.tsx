import { useParams } from 'react-router-dom';
import { Post } from '~/setup/features/posts/post.types';
import { MiniProfile, MiniPost, Spinner, Button } from '~/components';
import { useGetUserQuery } from '~/setup/features/users/users.api';

export function Account() {
	const { id } = useParams();
	const { data: user, isLoading } = useGetUserQuery(id!);

	return (
		<section className="w-full h-full">
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<div className="py-8 border-b">
						<MiniProfile {...user} />
					</div>
					<div className="p-4 flex flex-wrap gap-4 items-center justify-center">
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
				</>
			)}
		</section>
	);
}
