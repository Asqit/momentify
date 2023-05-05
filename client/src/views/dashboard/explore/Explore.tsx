import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost, MiniPostSkeleton } from '~/components';
import { useEffect, useState } from 'react';
import { PostWithReferences } from '~/setup/features/posts/posts.types';
import { useMediaQuery } from 'usehooks-ts';

/**
 * This function will split array into **n** amount of sub-arrays, where n is desired amount of sub-arrays
 */
function splitArray(array: any[], n: number) {
	const LEGTH = array.length / n; // Vypočtení délky menšího pole

	return [
		array.slice(0, length),
		array.slice(length, length * 2),
		array.slice(length * 2, length * 3),
	]; // Rozdělení pole na 3 menší pole o délce 4
}

export function Explore() {
	const { data, isLoading } = useGetGlobalFeedQuery();
	const [subArrays, setSubArrays] = useState<Partial<PostWithReferences>[] | null>(null);
	const isSingleColumn = useMediaQuery('(max-width: 600px)');
	const isTwoColumn = useMediaQuery('(min-width: 768px)');
	const isThreeColumn = useMediaQuery('(min-width: 1024px)');
	const isFourColumn = useMediaQuery('(min-width: 1280px)');

	useEffect(() => {
		if (data) {
		}
	}, [data]);

	return (
		<section className={'w-full h-full p-4 dark:text-gray-200'}>
			<div className="m-4">
				<h1 className="font-bold text-3xl my-2 md:text-4xl">Explore</h1>
				<p className="text-gray-400 my-2">Find a new person to follow</p>
				<hr className="dark:border-gray-800" />
			</div>
			<div
				className={
					'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4'
				}
			>
				{isLoading ? [...Array(10).keys()].map((i) => <MiniPostSkeleton key={i} />) : null}
				{data
					? data.map((post) => (
							<MiniPost
								title={post.title!}
								likedBy={post.likedBy!}
								author={post.author!}
								body={post.body!}
								createdAt={post.createdAt!}
								comments={post.comments!}
								id={post.id!}
								key={post.id}
							/>
					  ))
					: null}
			</div>
		</section>
	);
}
