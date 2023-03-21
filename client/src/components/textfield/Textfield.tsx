import React, { FC, InputHTMLAttributes, ReactNode, useState } from 'react';

interface ITextfieldComposition {
  SubComponent?: FC;
}

interface ITextfieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

export function Textfield(props: ITextfieldProps & ITextfieldComposition) {
  const { label, errorMessage, children, ...rest } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const outlineClass = errorMessage ? 'outline-red-600/50' : '';
  const alignmentClass = children ? 'inline-flex items-center' : 'inline-block';
  const focusClass = isFocused
    ? 'bg-white outline outline-4 outline-blue-500/20 border-sky-500'
    : 'bg-gray-200 border-gray-200';

  const styledClassName = `
  font-semibold text-black rounded-2xl border-2 py-2 px-4
  ${focusClass} ${alignmentClass} ${outlineClass}
`;

  return (
    <div className={styledClassName}>
      <div className='flex-grow'>
        {label && (
          <span
            className={`block text-sm ${
              isFocused ? 'text-sky-500' : 'text-gray-400'
            }`}
          >
            {label}
          </span>
        )}
        <input
          {...rest}
          className='w-full bg-transparent focus:outline-none text-lg'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {errorMessage && (
          <span className='block text-red-600'>{errorMessage}</span>
        )}
      </div>
      {children}
    </div>
  );
}

const SubComponent = (props: { children: ReactNode }) => {
  const { children } = props;

  return <>{children}</>;
};

Textfield.SubComponent = SubComponent;
