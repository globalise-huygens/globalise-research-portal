import * as React from 'react';

const IconTextLine = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.16406 2.33329V1.16663H12.8307V2.33329H1.16406ZM1.16406 12.8333V11.6666H12.8307V12.8333H1.16406ZM6.1224 10.2083V3.49996H7.8724V10.2083H6.1224Z"
      fill="currentColor"
    />
  </svg>
));
IconTextLine.displayName = 'IconTextLine';

export { IconTextLine };
