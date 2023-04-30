import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost, MiniPostSkeleton } from '~/components';

export function Home() {
	const { data, isLoading } = useGetGlobalFeedQuery();

	return (
		<section className={'w-full h-full'}>
			<div className={'flex flex-wrap p-4 gap-4'}>
				{isLoading ? [...Array(10).keys()].map((i) => <MiniPostSkeleton key={i} />) : null}
				{data
					? data.map((post) => (
							<div className="max-w-sm" key={post.id}>
								<MiniPost
									title={post.title!}
									likedBy={post.likedBy!}
									author={post.author!}
									body={post.body!}
									createdAt={post.createdAt!}
									id={post.id!}
								/>
							</div>
					  ))
					: null}
			</div>
		</section>
	);
}
