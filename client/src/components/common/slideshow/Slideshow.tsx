import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type SlideshowProps = {
	images: string[];
};

export function Slideshow(props: SlideshowProps) {
	const { images } = props;
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
		<div className="max-w-[500px] overflow-hidden mx-auto relative">
			<div
				className={`whitespace-nowrap transition-all duration-1000`}
				style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
			>
				{images.map((filename) => {
					return (
						<img
							crossOrigin="anonymous"
							className="w-full h-[400px] object-cover inline-block rounded-md"
							src={filename}
							key={filename}
							alt=""
						/>
					);
				})}
			</div>
			<button
				className={
					'absolute z-10 top-0 left-0 h-full px-2 backdrop-blur-md rounded-l-md  text-white text-xl'
				}
				onClick={moveLeft}
			>
				<FiChevronLeft />
			</button>
			<button
				className={
					'absolute z-10 top-0 right-0 h-full px-2 backdrop-blur-md rounded-r-md text-white text-xl'
				}
				onClick={moveRight}
			>
				<FiChevronRight />
			</button>
		</div>
	);
}