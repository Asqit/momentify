import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { LazyImage } from '../lazy-image/LazyImage';

type SlideshowProps = {
	images: string[];
	onClickCallback?: () => void;
};

export function Slideshow(props: SlideshowProps) {
	const { images, onClickCallback } = props;
	const [index, setIndex] = useState<number>(0);

	const moveRight = () => {
		setIndex((prev) => {
			return prev == images.length - 1 ? 0 : prev + 1;
		});
	};

	const moveLeft = () => {
		setIndex((prev) => {
			return prev <= 0 ? images.length - 1 : prev - 1;
		});
	};

	return (
		<div className="w-full overflow-hidden mx-auto relative rounded-md group bg-black">
			<div
				className={`whitespace-nowrap transition-all duration-1000 cursor-pointer`}
				style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
				onClick={() => {
					onClickCallback && onClickCallback();
				}}
			>
				{images.map((filename) => {
					return (
						<LazyImage
							className="w-full h-auto object-cover inline-block dark:brightness-75"
							src={filename}
							key={filename}
							alt={filename}
							loading="eager"
						/>
					);
				})}
			</div>
			<button
				className={
					'absolute z-10 -left-9 group-hover:left-0 transition-all w-[32px] h-[50px] top-1/2 px-2 backdrop-blur-md rounded-md  text-white text-xl'
				}
				onClick={moveLeft}
				type="button"
			>
				<FiChevronLeft />
			</button>
			<button
				type="button"
				className={
					'absolute z-10 -right-9 group-hover:right-0 transition-all w-[32px] h-[50px] top-1/2 px-2 backdrop-blur-md rounded-md text-white text-xl'
				}
				onClick={moveRight}
			>
				<FiChevronRight />
			</button>
		</div>
	);
}
