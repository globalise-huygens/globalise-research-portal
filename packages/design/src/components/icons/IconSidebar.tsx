import { SVGProps } from 'react';

export function IconSidebar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 12"
      fill="currentColor"
      {...props}
    >
      <path d="M10.5 12H0V0H10.5V12ZM12 3H15V0H12V3ZM12 12H15V9H12V12ZM12 7.5H15V4.5H12V7.5Z" />
    </svg>
  );
}
