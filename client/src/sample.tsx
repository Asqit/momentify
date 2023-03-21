// =================================================
// Sample.txt
// This is a sketch of my TextField component
// how it could look as compound-component
// =================================================

import { useContext, createContext, useState, ReactNode } from 'react';

const FormGroupContext = createContext({});

interface IFormGroupProps {
  children: ReactNode;
}

export function FormGroup(props: IFormGroupProps) {
  const { children } = props;
  return (
    <FormGroupContext.Provider value={{}}>{children}</FormGroupContext.Provider>
  );
}


export function FormGroup.
