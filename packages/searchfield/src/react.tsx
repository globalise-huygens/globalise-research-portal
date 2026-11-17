import React, { type Ref, useEffect, useImperativeHandle, useRef } from 'react';
import { default as SF } from './SearchField';
import type SearchFieldConfig from './SearchFieldConfig';

export type SearchFieldRef = {
  search: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  focus: () => void;
};

export type SearchFieldProps<E extends object> = {
  className?: string;
  ref: Ref<SearchFieldRef>;
} & Partial<SearchFieldConfig<E>>;

export default function SearchField<E extends object>({ className, ref, ...config }: SearchFieldProps<E>) {
  const elRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<SF<E>>(null);

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    const el = elRef.current;
    if (!el) {return;}

    instanceRef.current = new SF(el, configRef.current);

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    search: () => instanceRef.current?.search(),
    undo: () => instanceRef.current?.undo(),
    redo: () => instanceRef.current?.redo(),
    clear: () => instanceRef.current?.clear(),
    focus: () => instanceRef.current?.focus(),
  }), []);

  return (
    <div className={className} ref={elRef}/>
  );
}
