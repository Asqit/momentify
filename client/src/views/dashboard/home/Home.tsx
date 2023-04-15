import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost } from '~/components/dashboardWidgets/mini-post/MiniPost';
import { Post } from '~/setup/features/posts/post.types';

export function Home() {
	const { data, isLoading } = useGetGlobalFeedQuery(null);

	return (
		<section className={'p-4'}>
			{data ? (
				<div className={'flex items-center justify-center flex-wrap p-8 gap-4'}>
					{(data as any).results.map((post: Post) => (
						<MiniPost
							title={post.title}
							likes={post.likedBy.length}
							author={post.author}
							body={post.body}
							createdAt={post.createdAt}
							key={post.id}
						/>
					))}
				</div>
			) : null}
		</section>
	);
}
