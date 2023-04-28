import { FaRegComment, FaRegHeart } from 'react-icons/fa';

export function MiniPostSkeleton() {
	return (
		<div className="p-2">
			<div className="mb-2">
				<div className="max-w-[500px] w-[300px] bg-gray-400 aspect-square animate-pulse rounded-md" />
			</div>
			<div className="mt-4 flex items-center justify-between px-4">
				<div className={'flex gap-x-4 items-center'}>
					<div className="w-[32px] aspect-square rounded-full bg-gray-400 animate-pulse outline-2 outline-offset-2 outline-sky-500" />
					<b className="capitalize w-[32px] h-[16px] bg-gray-400 animate-pulse" />
				</div>
				<div className="flex gap-x-3">
					<div className="flex items-center text-lg gap-x-2">
						<FaRegHeart />0
					</div>
					<span className="flex items-center text-lg gap-x-2">
						<FaRegComment />0
					</span>
				</div>
			</div>
		</div>
	);
}
