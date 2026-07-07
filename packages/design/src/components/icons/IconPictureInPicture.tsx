import { SVGProps } from 'react';

export function IconPictureInPicture(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="currentColor"
      {...props}
    >
      <path d="M1.148 15.5v-12h15v12h-15Zm1.5-1.5h12V5h-12v9Zm5.25-.75h6v-4.5h-6v4.5Zm1.5-1.5v-1.5h3v1.5h-3Z" />
    </svg>
  );
}
