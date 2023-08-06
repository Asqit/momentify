import { useGetGlobalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost, MiniPostSkeleton } from '~/components';
import { useTranslation } from 'react-i18next';

export function Explore() {
	const { data, isLoading } = useGetGlobalFeedQuery();
	const { t } = useTranslation();

	return (
		<section className={'w-full h-full p-4 dark:text-gray-200'}>
			<div className="m-4">
				<h1 className="font-bold text-3xl my-2 md:text-4xl">{t('explore.title')}</h1>
				<p className="text-gray-400 my-2">{t('explore.subtitle')}</p>
				<hr className="dark:border-gray-800" />
			</div>
			<div className={'masonry sm:masonry-sm md:masonry-md'}>
				{isLoading ? [...Array(10).keys()].map((i) => <MiniPostSkeleton key={i} />) : null}
				{data
					? data.map((post) => (
							<div className="break-inside my-2">
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
							</div>
					  ))
					: null}
			</div>
		</section>
	);
}
