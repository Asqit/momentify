import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type SlideshowProps = {
	images: string[];
	onClickCallback: () => void;
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
		<div className="max-w-[500px] overflow-hidden mx-auto relative rounded-md group">
			<div
				className={`whitespace-nowrap transition-all duration-1000 cursor-pointer`}
				style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
				onClick={onClickCallback}
			>
				{images.map((filename) => {
					return (
						<img
							crossOrigin="anonymous"
							className="w-full aspect-square object-cover inline-block"
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
					'absolute z-10 top-0 -left-9 group-hover:left-0 transition-all h-full px-2 backdrop-blur-md rounded-l-md  text-white text-xl'
				}
				onClick={moveLeft}
				type="button"
			>
				<FiChevronLeft />
			</button>
			<button
				type="button"
				className={
					'absolute z-10 top-0 -right-9 group-hover:right-0 transition-all h-full px-2 backdrop-blur-md rounded-r-md text-white text-xl'
				}
				onClick={moveRight}
			>
				<FiChevronRight />
			</button>
		</div>
	);
}
