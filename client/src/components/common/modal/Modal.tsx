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
		<div className={`fixed z-50 inset-0 ${isOpen ? '' : 'pointer-events-none'}`}>
			<div
				onClick={callback}
				className={`fixed inset-0 ${
					isOpen
						? 'bg-black/50 backdrop-blur-md'
						: 'bg-transparent pointer-events-none opacity-0'
				}`}
			/>
			<div
				className={`fixed left-1/2 translate-x-[-50%] h-fit bg-white shadow-lg  p-4 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				} ${className} `}
			>
				{children}
			</div>
		</div>
	);
}
