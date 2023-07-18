import { ImgHTMLAttributes, useEffect, useState } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
	src: string;
}

export function LazyImage(props: LazyImageProps) {
	const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

	useEffect(() => {
		setLoadedSrc(null);
		if (props.src) {
			const handleLoad = () => {
				setLoadedSrc(props.src);
			};

			const image = new Image();

			image.addEventListener('load', handleLoad);
			image.src = props.src;

			return () => {
				image.removeEventListener('load', handleLoad);
			};
		}
	}, [props.src]);

	if (loadedSrc === props.src) {
		return <img {...props} />;
	}

	return (
		<div
			className={`"bg-slate-400 animate-pulse rounded-md" ${
				props.className ? props.className : ''
			}`}
		/>
	);
}
