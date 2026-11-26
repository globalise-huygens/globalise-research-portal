import { SVGProps } from 'react';

export function IconToll(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M9.33,17.68Q7,15.35 7,12T9.33,6.32T15,4t5.68,2.32T23,12t-2.32,5.68T15,20T9.33,17.68ZM7,19.75q-2.65-0.7-4.32-2.85T1,12T2.68,7.1T7,4.25v2.1Q5.2,6.97 4.1,8.52T3,12t1.1,3.47T7,17.65v2.1ZM15,12Zm4.25,4.25Q21,14.5 21,12T19.25,7.75T15,6T10.75,7.75T9,12t1.75,4.25T15,18t4.25-1.75Z" />
    </svg>
  );
}
