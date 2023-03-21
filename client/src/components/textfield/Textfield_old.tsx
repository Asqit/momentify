import { FC, InputHTMLAttributes, useState } from 'react';

interface ITextfieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Basically a simple replacement for label element
   * */
  label?: string;

  /** `SubComponent` props is a optional element, that can be passed to the end of textfield.
   * It could be a Icon or Button...or whatever you want.
   * */
  SubComponent?: FC;

  /**
   * String containing validation errors.
   */
  errorMessage?: string;
}

export function Textfield(props: ITextfieldProps) {
  const { errorMessage, label, SubComponent, className, ...rest } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const styledClassName = `font-semibold text-black rounded-lg bg-gray-200 p-2 ${
    isFocused ? 'bg-white outline outline-4 outline-blue-500/50' : ''
  } ${errorMessage ? 'outline-red-600/50' : ''}  ${
    SubComponent ? 'inline-flex items-center' : 'inline-block'
  } ${className ? className : ''}`;

  return (
    <div className={styledClassName}>
      <div>
        {label ? <span className='block text-sm'>{label}</span> : null}
        <input
          {...rest}
          className='bg-transparent focus:outline-none text-lg'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {errorMessage ? (
          <span className='block text-red-600'>{errorMessage}</span>
        ) : null}
      </div>
      {SubComponent ? (
        <div className='text-3xl'>
          <SubComponent />
        </div>
      ) : null}
    </div>
  );
}
