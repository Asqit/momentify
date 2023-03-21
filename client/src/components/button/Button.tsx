import { ButtonHTMLAttributes, FC } from 'react';

type ButtonColor = 'primary' | 'secondary' | 'danger';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: FC;
  buttonColor?: ButtonColor;
}

export function Button(props: IButtonProps) {
  const { className, buttonColor, Icon, ...rest } = props;

  let styledClassName = `btn ${buttonColor ? buttonColor : ''} ${
    Icon ? 'flex items-center just-center gap-x-2' : ''
  } ${className ? className : ''}`;

  return (
    <button {...rest} className={styledClassName}>
      {Icon ? <Icon /> : null}
      {rest.children}
    </button>
  );
}
