import { useState } from 'react';

interface ToggleSwitchProps {
	/** Initial state of the switch */
	isEnabled?: boolean;

	/** What should be executed when switch is toggled */
	callback: (currentState?: boolean) => void;

	/** **experimental property** use only for testing */
	width?: number;

	/** **experimental property** use only for testing */
	height?: number;
}

export function ToggleSwitch(props: ToggleSwitchProps) {
	const { callback, isEnabled, width, height } = props;
	const [isActive, setIsActive] = useState<boolean>(isEnabled ?? false);

	const WIDTH = width ? width : 50;
	const HEIGHT = height ? height : 25;
	const WIDTH_HALF = width ? width / 2 : 25;

	const handleClick = () => {
		setIsActive((prev) => !prev);

		callback(isActive);
	};

	return (
		<button
			className={`inline-block rounded-xl w-[${WIDTH}px] h-[${HEIGHT}px] bg-gray-300 dark:bg-gray-950 relative`}
			onClick={handleClick}
		>
			<figure
				className={`inline-block w-[${
					WIDTH_HALF + 'px'
				}] h-[${HEIGHT}px] rounded-full border  absolute top-0 transition-all ${
					isActive
						? `left-[${WIDTH_HALF}px] bg-sky-500 dark:border-sky-800`
						: 'left-0 bg-white dark:border-gray-800'
				}`}
			/>
		</button>
	);
}
