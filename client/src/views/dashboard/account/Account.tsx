import { useLocation } from 'react-router-dom';
import { Post } from '~/setup/features/posts/post.types';
import { MiniProfile, MiniPost } from '~/components';

export function Account() {
	const data = useLocation();

	const { user } = data.state;

	return (
		<section>
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
									likes={post.likedBy.length}
									createdAt={post.createdAt}
									key={post.id}
								/>
							);
					  })
					: null}
			</div>
		</section>
	);
}
