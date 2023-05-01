import { useState } from 'react';

interface ToggleSwitchProps {
	/** Initial state of the switch */
	isEnabled?: boolean;

	/** What should be executed when switch is toggled */
	callback: (currentState?: boolean) => void;
}

export function ToggleSwitch(props: ToggleSwitchProps) {
	const { callback, isEnabled } = props;
	const [isActive, setIsActive] = useState<boolean>(isEnabled ?? false);

	const handleClick = () => {
		setIsActive((prev) => !prev);

		callback(isActive);
	};

	return (
		<button
			className={`inline-block rounded-xl w-[50px] h-[25px] bg-gray-300 dark:bg-gray-950 relative`}
			onClick={handleClick}
		>
			<figure
				className={`inline-block w-[25px] h-[25px] rounded-full border  absolute top-0 transition-all ${
					isActive
						? `left-[25px] bg-sky-500 dark:border-sky-800`
						: 'left-0 bg-white dark:border-gray-800'
				}`}
			/>
		</button>
	);
}
