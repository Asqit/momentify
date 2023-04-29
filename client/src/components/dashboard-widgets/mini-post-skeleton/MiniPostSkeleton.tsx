import { FaRegComment, FaRegHeart } from 'react-icons/fa';

export function MiniPostSkeleton() {
	return (
		<div className="p-2 w-fit h-fit dark:bg-gray-950 dark:text-gray-200 rounded-md">
			<div className="mb-2">
				<figure className="w-[366px] aspect-square bg-gray-400 animate-pulse rounded-md" />
			</div>
			<div className="mt-4 flex items-center justify-between px-4 gap-x-4">
				<div className={'flex gap-x-4 items-center'}>
					<figure className="inline-block w-[32px] aspect-square rounded-full bg-gray-200 animate-pulse" />
					<span className="inline-block w-[64px] h-[16px] bg-gray-200 animate-pulse rounded-md" />
				</div>
				<div className="flex gap-x-3 animate-pulse">
					<div className="flex items-center text-lg gap-x-2">
						<FaRegHeart />
					</div>
					<span className="flex items-center text-lg gap-x-2">
						<FaRegComment />
					</span>
				</div>
			</div>
		</div>
	);
}
