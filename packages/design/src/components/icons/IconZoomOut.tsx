import { SVGProps } from 'react';

export function IconZoomOut(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="currentColor"
      {...props}
    >
      <path d="M11.625 10.5h-.593l-.21-.203A4.852 4.852 0 0 0 12 7.125 4.873 4.873 0 0 0 7.125 2.25 4.873 4.873 0 0 0 2.25 7.125 4.873 4.873 0 0 0 7.125 12a4.852 4.852 0 0 0 3.172-1.178l.203.21v.593l3.75 3.742 1.117-1.117-3.742-3.75Zm-4.5 0A3.37 3.37 0 0 1 3.75 7.125 3.37 3.37 0 0 1 7.125 3.75 3.37 3.37 0 0 1 10.5 7.125 3.37 3.37 0 0 1 7.125 10.5ZM5.25 6.75H9v.75H5.25v-.75Z" />
    </svg>
  );
}
