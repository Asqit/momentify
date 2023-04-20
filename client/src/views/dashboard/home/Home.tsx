import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost, MiniPostSkeleton } from '~/components';
import { Post } from '~/setup/features/posts/posts.types';
import { Suspense } from 'react';

export function Home() {
	const { data, isLoading } = useGetGlobalFeedQuery();

	return (
		<section className={'w-full h-full'}>
			<div className={'p-4 flex flex-wrap gap-2 justify-center items-center'}>
				{isLoading ? [...Array(10).keys()].map((i) => <MiniPostSkeleton key={i} />) : null}
				{data
					? data.map((post) => (
							<MiniPost
								title={post.title}
								likedBy={post.likedBy}
								author={post.author}
								body={post.body}
								createdAt={post.createdAt}
								key={post.id}
								id={post.id}
							/>
					  ))
					: null}
			</div>
		</section>
	);
}
