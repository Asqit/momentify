import { ReactNode } from 'react';
import { GrFormClose } from 'react-icons/gr';

interface ModalProps {
	children: ReactNode;
	isOpen: boolean;
	callback: () => void;
	className?: string;
}

export function Modal(props: ModalProps) {
	const { children, isOpen, callback, className } = props;

	return (
		<div className={`fixed inset-0 ${isOpen ? '' : 'pointer-events-none'}`}>
			<div
				onClick={callback}
				className={`fixed inset-0 bg-black ${
					isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'
				}`}
			/>
			<div
				className={`fixed left-1/2 translate-x-[-50%] h-fit bg-white shadow-lg w-1/2 max-w-screen-sm p-4 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				} ${className ?? ''}`}
			>
				<GrFormClose
					onClick={callback}
					className={`absolute right-4 top-4 text-3xl cursor-pointer`}
				/>

				{children}
			</div>
		</div>
	);
}
