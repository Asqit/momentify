import { Slideshow } from '~/components/common';
import { useMemo } from 'react';

type MemoizedSlideshowProps = {
	images: string[];
	callback?: () => void;
};

export function MemoizedSlideshow(props: MemoizedSlideshowProps) {
	const { images, callback } = props;

	const memoizedSlideshow = useMemo(() => {
		return <Slideshow images={images} onClickCallback={callback} />;
	}, [images]);

	return memoizedSlideshow;
}
