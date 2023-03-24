import { useState } from 'react';

interface IHamburgerProps {
  open?: boolean;
  onClick?: () => void;
  containerClassName?: string;
}

export function Hamburger(props: IHamburgerProps) {
  const { open, onClick, containerClassName } = props;
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-8 h-8 flex justify-around flex-col flex-wrap z-10 cursor-pointer ${containerClassName}`}
    >
      <span
        className={`bg-slate-200 block w-8 h-[0.35rem] rounded transition-all origin-[1px] ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      />
      <span
        className={`bg-slate-200 block w-8 h-[0.35rem] rounded transition-all origin-[1px] ${
          isOpen ? 'translate-x-full bg-transparent' : 'translate-x-0'
        }`}
      />
      <span
        className={`bg-slate-200 block w-8 h-[0.35rem] rounded transition-all origin-[1px] ${
          isOpen ? 'rotate-[-45deg]' : 'rotate-0'
        }`}
      />
    </button>
  );
}
