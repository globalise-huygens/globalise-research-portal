import * as React from 'react';

const BaseLogoSvg = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ children, ...props }, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 1000 338"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
));
BaseLogoSvg.displayName = 'BaseLogoSvg';

export { BaseLogoSvg };
