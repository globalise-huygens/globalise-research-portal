import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  Form as AriaForm,
  type FormProps as AriaFormProps,
  Input as AriaInput,
  Label as AriaLabel,
  TextField as AriaTextField,
} from 'react-aria-components';

export type NewsletterSignupProps = {
  className?: string;
  /** Image element rendered on the left side */
  image?: React.ReactNode;
  /** Heading text */
  heading: string;
  /** Description paragraph */
  description: string;
  /** Placeholder for email input */
  inputPlaceholder?: string;
  /** Submit button label */
  submitLabel?: string;
  /** Privacy notice (supports JSX for links) */
  privacyText?: React.ReactNode;
  /** Name used for the email field */
  inputName?: string;
} & Omit<
  AriaFormProps,
  'children' | 'className' | 'style'
>;

const NewsletterSignup = React.forwardRef<
  HTMLFormElement,
  NewsletterSignupProps
>(
  (
    {
      className,
      image,
      heading,
      description,
      inputPlaceholder = 'Your email',
      submitLabel = 'Subscribe',
      privacyText,
      inputName = 'email',
      ...props
    },
    ref,
  ) => (
    <AriaForm
      ref={ref}
      className={cn('gds-newsletter', className)}
      {...props}
    >
      <div className="gds-newsletter__intro-grid">
        <div className="gds-newsletter__intro">
          <h3 className="gds-newsletter__heading">{heading}</h3>
          <p className="gds-newsletter__description">{description}</p>
        </div>
      </div>

      <div className="gds-newsletter__form-grid">
        {image && <div className="gds-newsletter__image">{image}</div>}
        <div
          className="gds-newsletter__panel"
          data-has-image={image ? 'true' : undefined}
        >
          <AriaTextField
            name={inputName}
            type="email"
            isRequired
            autoComplete="email"
            className="gds-newsletter__field"
          >
            <AriaLabel className="gds-newsletter__label">
              Email address
            </AriaLabel>
            <AriaInput
              placeholder={inputPlaceholder}
              className="gds-newsletter__input"
            />
            <AriaButton type="submit" className="gds-newsletter__submit">
              {submitLabel}
            </AriaButton>
          </AriaTextField>
          {privacyText && (
            <span className="gds-newsletter__privacy">{privacyText}</span>
          )}
        </div>
      </div>
    </AriaForm>
  ),
);
NewsletterSignup.displayName = 'NewsletterSignup';

export { NewsletterSignup };
