import { IconArrowTopRight } from '@globalise/design';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import '../../router/src/FallbackPage.css';

export function NotFoundPage() {
  return (
    <FallbackPage
      status="404"
      title="Page not found"
      description="This page may have moved, or the address may be incorrect."
    >
      <FallbackLink to="/" className="primary">Back to home</FallbackLink>
      <FallbackLink to="/content">Search site content</FallbackLink>
      <FallbackLink to="/search">Search the archive</FallbackLink>
    </FallbackPage>
  );
}

export function RouteErrorPage() {
  return (
    <FallbackPage
      status="Error"
      title="This page couldn’t load"
      description="Try loading the page again, or return to the home page."
    >
      <button
        type="button"
        className="primary"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
      <FallbackLink to="/">Back to home</FallbackLink>
    </FallbackPage>
  );
}

function FallbackPage({
  status,
  title,
  description,
  children,
}: {
  status: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="fallback-page">
      <div className="gds-container" data-size="shell">
        <div className="gds-grid">
          <div className="message slot-content-narrow">
            <p className="status">{status}</p>
            <h1>{title}</h1>
            <p className="description">{description}</p>
            <div className="actions">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FallbackLink({
  to,
  className,
  children,
}: {
  to: '/' | '/content' | '/search';
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={className}>
      {children}
      <IconArrowTopRight width="16" height="16" aria-hidden="true"/>
    </Link>
  );
}
