import { useState, DragEvent, FC, ReactNode, HTMLAttributes, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
	onFileDrop: (files: FileList) => void;
	children: ReactNode;
}

export const DragAndDrop: FC<Props> = ({ onFileDrop, children, ...rest }) => {
	const [dragging, setDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);
		onFileDrop(e.dataTransfer.files);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			onFileDrop(e.target.files);
		}
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={handleClick}
			{...rest}
		>
			{dragging ? <div>Drop your files here</div> : children}
			<input
				ref={fileInputRef}
				type={'file'}
				multiple={true}
				className={'hidden'}
				onChange={handleFileInputChange}
			/>
		</div>
	);
};
