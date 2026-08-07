import { SVGProps } from 'react';

/** A small book/A mark used for thesaurus concepts. */
export function IconEntityConcept(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M4 4.5h13a3 3 0 0 1 3 3v12H7a3 3 0 0 1-3-3v-12Z" />
      <path d="M7 19.5V7.5a3 3 0 0 1 3-3" />
      <path d="m12 14 1.5-4 1.5 4m-2.5-1h2" />
    </svg>
  );
}
