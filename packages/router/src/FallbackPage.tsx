import { Link, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import './FallbackPage.css';

export function NotFoundPage() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isContentPath = pathname.startsWith('/content/');

  return (
    <FallbackPage
      status="404"
      title="Page not found"
      description="This page may have moved, or the address may be incorrect."
    >
      <Link to="/" className="primary">Back to home</Link>
      {isContentPath
        ? <Link to="/content">Search site content</Link>
        : <Link to="/search">Search the archive</Link>}
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
      <Link to="/">Back to home</Link>
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
      <div className="message">
        <p className="status">{status}</p>
        <h1>{title}</h1>
        <p className="description">{description}</p>
        <div className="actions">{children}</div>
      </div>
    </main>
  );
}
