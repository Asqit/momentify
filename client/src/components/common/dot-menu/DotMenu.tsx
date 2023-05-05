import { ReactNode, useState } from 'react';

interface DotMenuProps {
	isOpen?: boolean;
	children: ReactNode;
}

export function DotMenu(props: DotMenuProps) {
	const { isOpen, children } = props;
	const [isActive, setIsActive] = useState<boolean>(isOpen ?? false);

	return (
		<div className="relative">
			<button
				className={`group ${!isActive ? 'hover:animate-pulse' : 'hover:animate-none'}`}
				onClick={() => setIsActive((prev) => !prev)}
			>
				<div
					className={`inline-block transition-all w-[8px] h-[8px] ${
						isActive ? 'mx-0' : 'mx-[2px]'
					} rounded-full bg-sky-500`}
				/>
				<div
					className={`inline-block transition-all w-[8px] h-[8px] ${
						isActive ? 'mx-0' : 'mx-[2px]'
					} rounded-full bg-sky-500`}
				/>
				<div
					className={`inline-block transition-all w-[8px] h-[8px] ${
						isActive ? 'mx-0' : 'mx-[2px]'
					} rounded-full bg-sky-500`}
				/>
			</button>
			<div
				className={`${
					isActive ? 'block' : 'hidden'
				} animate-ping-once absolute top-full right-0 z-20 w-fit h-fit p-2 rounded-md shadow-md bg-white dark:bg-gray-800`}
			>
				{children}
			</div>
		</div>
	);
}
