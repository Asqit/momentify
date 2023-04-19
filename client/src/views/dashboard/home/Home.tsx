import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost } from '~/components';
import { Post } from '~/setup/features/posts/post.types';

export function Home() {
	const { data, isLoading } = useGetGlobalFeedQuery();

	return (
		<section className={'p-4'}>
			{data ? (
				<div className={'flex items-center justify-center flex-wrap p-8 gap-4'}>
					{data.map((post: Post) => (
						<MiniPost
							title={post.title}
							likedBy={post.likedBy}
							author={post.author}
							body={post.body}
							createdAt={post.createdAt}
							key={post.id}
							id={post.id}
						/>
					))}
				</div>
			) : null}
		</section>
	);
}
