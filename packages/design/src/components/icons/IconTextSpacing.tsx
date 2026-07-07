import * as React from 'react';

const IconTextSpacing = React.forwardRef<
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
      d="M1.45703 11.375V2.625H2.33203V11.375H1.45703ZM11.6654 11.375V2.625H12.5404V11.375H11.6654ZM4.40957 9.91667L6.57462 4.10579H7.40586L9.58782 9.91667H8.77232L8.21364 8.34502H5.76699L5.21384 9.91667H4.40957ZM6.01709 7.66748H7.96907L7.01664 4.96621H6.96953L6.01709 7.66748Z"
      fill="currentColor"
    />
  </svg>
));
IconTextSpacing.displayName = 'IconTextSpacing';

export { IconTextSpacing };
