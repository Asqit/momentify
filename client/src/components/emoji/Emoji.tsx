interface IEmojiProps {
  label?: string;
  symbol: string;
}

export function Emoji(props: IEmojiProps) {
  const { symbol, label } = props;

  return (
    <span
      className='emoji'
      role='img'
      aria-label={label ? label : 'emoji symbol'}
      aria-hidden={label ? 'false' : 'true'}
    >
      {symbol}
    </span>
  );
}
