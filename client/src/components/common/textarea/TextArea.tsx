import { FC, ReactNode, TextareaHTMLAttributes, useState } from 'react';

interface TextfieldComposition {
	SubComponent?: FC;
}

interface TextfieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	errorMessage?: string;
	parentClassName?: string;
}

export function TextArea(props: TextfieldProps & TextfieldComposition) {
	const { label, errorMessage, parentClassName, children, ...rest } = props;
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const outlineClass = errorMessage ? 'outline-red-600/50 border-red-600' : '';
	const alignmentClass = children ? 'inline-flex items-center' : 'inline-block';
	const focusClass = isFocused
		? 'bg-white dark:bg-gray-700 outline outline-4 outline-blue-500/20 border-sky-500'
		: 'bg-gray-200 border-gray-200 dark:bg-gray-600 dark:border-gray-700';

	const styledClassName = ` 
  font-semibold text-black dark:text-gray-200 rounded-md border-2 py-2 px-4
  ${focusClass} ${alignmentClass} ${outlineClass} ${parentClassName ? parentClassName : ''}
`;

	return (
		<div className={styledClassName}>
			<div className="flex-grow">
				{label && (
					<span className={`block text-sm ${isFocused ? 'text-sky-500' : 'text-gray-400'}`}>
						{label}
					</span>
				)}
				<textarea
					{...rest}
					className="w-full bg-transparent focus:outline-none text-lg"
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				{errorMessage && <span className="block text-red-600">{errorMessage}</span>}
			</div>
			{children}
		</div>
	);
}

const SubComponent = (props: { children: ReactNode }) => {
	const { children } = props;

	return <>{children}</>;
};

TextArea.SubComponent = SubComponent;
