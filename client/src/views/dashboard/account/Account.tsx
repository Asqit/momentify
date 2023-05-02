import { useParams } from 'react-router-dom';
import { Post } from '~/setup/features/posts/posts.types';
import { MiniPost, Spinner, ProfileDetails } from '~/components';
import { useGetUserQuery } from '~/setup/features/users/users.api';

export function Account() {
	const { id } = useParams();
	const { data: user, isLoading } = useGetUserQuery(id!);

	if (!user) {
		return (
			<section className="w-full h-full flex flex-col gap-1">
				<h1>Account could not be loaded</h1>
			</section>
		);
	}

	return (
		<section className="w-full h-full">
			{isLoading ? (
				<Spinner />
			) : (
				<div className="px-4">
					<div className="py-8">
						<ProfileDetails
							username={user.username}
							email={user.email}
							id={user.id}
							profilePicture={user.profilePicture}
							posts={user.posts}
							followersIds={user.followersIds}
							followingIds={user.followingIds}
						/>
					</div>
					<hr className="dark:border-gray-800" />
					<div
						className={
							'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4'
						}
					>
						{user && user.posts && user.posts.length > 0
							? user.posts.map((post: Post) => {
									return (
										<div className="w-full md:max-w-sm" key={post.id}>
											<MiniPost
												title={post.title!}
												likedBy={post.likedBy!}
												author={user}
												body={post.body!}
												createdAt={post.createdAt!}
												comments={post.comments!}
												id={post.id!}
											/>
										</div>
									);
							  })
							: null}
					</div>
				</div>
			)}
		</section>
	);
}
