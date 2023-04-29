import { FaRegHeart, FaRegComment } from 'react-icons/fa';

export const PostSkeleton = () => (
	<article className="w-full max-w-2xl mx-auto h-full p-4 dark:bg-gray-950 dark:text-gray-200 overflow-y-auto">
		<div className="flex items-center gap-x-2 my-4">
			<figure className="inline-block w-[32px] aspect-square rounded-full bg-gray-200 animate-pulse" />
			<span className="inline-block w-[64px] h-[16px] bg-gray-200 animate-pulse rounded-md" />
		</div>
		<figure className="w-full aspect-square max-h-[500px] bg-gray-400 animate-pulse rounded-md" />
		<div className="flex gap-x-3 my-4">
			<div className="flex items-center text-2xl gap-x-2 animate-pulse">
				<FaRegHeart />
			</div>
			<span className="flex items-center text-2xl gap-x-2 animate-pulse">
				<FaRegComment />
			</span>
		</div>
		<span
			className={`inline-block w-[96px] h-[16px] bg-gray-200 animate-pulse rounded-md`}
		/>
		<hr className="dark:border-gray-800 my-4" />
		<ul>
			{[...Array(2).keys()].map((i) => (
				<li key={i} className="flex items-center gap-x-2 my-8">
					<figure className="inline-block w-[32px] aspect-square rounded-full bg-gray-200 animate-pulse" />
					<span
						className={`inline-block w-[96px] h-[16px] bg-gray-200 animate-pulse rounded-md`}
					/>
				</li>
			))}
		</ul>

		<div className="w-full h-[64px] bg-gray-200 rounded-md" />
	</article>
);
