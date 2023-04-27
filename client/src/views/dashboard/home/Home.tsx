import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost, MiniPostSkeleton } from '~/components';

export function Home() {
	const { data, isLoading } = useGetGlobalFeedQuery();

	return (
		<section className={'w-full h-full'}>
			<div className={'flex flex-wrap py-[4px]'}>
				{isLoading ? [...Array(10).keys()].map((i) => <MiniPostSkeleton key={i} />) : null}
				{data
					? data.map((post) => (
							<div className="flex-[25%] py-[4px] align-middle dev">
								<MiniPost
									title={post.title!}
									likedBy={post.likedBy!}
									author={post.author!}
									body={post.body!}
									createdAt={post.createdAt!}
									key={post.id}
									id={post.id!}
								/>
							</div>
					  ))
					: null}
			</div>
		</section>
	);
}
