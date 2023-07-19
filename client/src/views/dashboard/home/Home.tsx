import { useGetPersonalFeedQuery } from '~/setup/features/posts/posts.api';
import { MiniPost, MiniPostSkeleton } from '~/components';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function Home() {
	const { data, isLoading, refetch } = useGetPersonalFeedQuery();
	const { t } = useTranslation();

	const handleFeedFetch = async () => {
		try {
			await refetch().unwrap();
		} catch (error) {}
	};

	useEffect(() => {
		handleFeedFetch();
	}, []);

	return (
		<section className={'w-full h-full p-4 dark:text-gray-200'}>
			<div className="m-4">
				<h1 className="font-bold text-3xl my-2 md:text-4xl">{t('home.title')}</h1>
				<p className="text-gray-400 my-2">{t('home.subtitle')}</p>
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
