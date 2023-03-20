import { ButtonHTMLAttributes, FC } from 'react';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: FC;
}

export function Button(props: IButtonProps) {
  const { Icon, ...rest } = props;

  return (
    <button {...rest}>
      {Icon ? <Icon /> : null}
      {rest.children}
    </button>
  );
}
