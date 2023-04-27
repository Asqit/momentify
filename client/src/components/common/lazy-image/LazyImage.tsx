import { ImgHTMLAttributes, useState } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export function LazyImage(props: LazyImageProps) {
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	return (
		<>
			{isLoaded === false ? (
				<div className="w-full min-w-[300px] inline-block aspect-square bg-gray-400 animate-pulse rounded-md" />
			) : null}

			<img
				{...props}
				onLoad={() => {
					setIsLoaded((prev) => !prev);
				}}
				className={`${props.className ? props.className : ''} ${
					isLoaded ? 'inline-block' : 'hidden'
				}`}
			/>
		</>
	);
}
