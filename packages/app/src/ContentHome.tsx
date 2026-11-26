import { ContentSearchIcon } from './ContentSearchIcon.tsx';
import { IconArrowLeftAlt, IconArrowTopRight } from '@globalise/design';
import { getRouteApi, toHref, useRouter } from '@globalise/router';
import { Button, Link } from 'react-aria-components';
import type { ContentIndex, PageMeta } from '@globalise/content';
import type { SubmitEvent } from 'react';
import type { SearchResult } from 'minisearch';
import { Highlight } from './Highlight.tsx';
import { createSnippet } from './highlightTerms.ts';
import { useContentSearchIndex } from './useContentSearchIndex.ts';
import './ContentHome.css';

const route = getRouteApi('/content/');

type ContentResult = Pick<PageMeta, 'slug' | 'title' | 'type'> & {
  snippet: string;
  terms: string[];
};

export function ContentHome() {
  const pages: ContentIndex = route.useLoaderData();
  const { q } = route.useSearch();
  const navigate = route.useNavigate();

  function searchContent(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('q');
    const query = typeof value === 'string' ? value.trim() : '';
    void navigate({ search: { q: query || undefined } });
  }

  return (
    <main className="content-home">
      <header className="intro">
        <p className="eyebrow">Website content</p>
        <h1>Search the website</h1>
        <p>Find project information, articles and blog posts. For historical documents, use the archive search.</p>
        <form className="search-field" onSubmit={searchContent}>
          <input
            key={q ?? ''}
            type="search"
            name="q"
            aria-label="Search website content"
            defaultValue={q ?? ''}
            placeholder="Search website content"
          />
          <Button type="submit" aria-label="Search website content">
            <ContentSearchIcon/>
            Search
          </Button>
        </form>
        <div className="links">
          <Link href={toHref({ to: '/content/blog' })}>
            <IconArrowLeftAlt width="16" height="16" aria-hidden="true"/> Browse the blog
          </Link>
          <Link href={toHref({ to: '/search', search: { q } })}>
            <IconArrowLeftAlt width="16" height="16" aria-hidden="true"/> Search the archive
          </Link>
        </div>
      </header>
      {q
        ? <ContentSearchResults query={q}/>
        : <ResultList results={pages.map(toBrowseResult)}/>}
    </main>
  );
}

function ContentSearchResults({ query }: { query: string }) {
  const { data: searchIndex, isError } = useContentSearchIndex();
  if (isError) {
    return <p role="status">Website search is unavailable. Please try again.</p>;
  }
  if (!searchIndex) {
    return <p role="status">Searching website content…</p>;
  }

  const results = searchIndex.search(query).map(toSearchResult);
  if (!results.length) {
    return <p role="status">No results for “{query}”. Try a different search.</p>;
  }
  return <ResultList results={results} query={query}/>;
}

function ResultList({
  results,
  query,
}: {
  results: ContentResult[];
  query?: string;
}) {
  const router = useRouter();
  const countLabel = results.length === 1 ? 'result' : 'results';

  return (
    <section aria-labelledby="content-results">
      <h2 id="content-results" role="status">
        {query ? `${results.length} ${countLabel} for “${query}”` : 'Browse website content'}
      </h2>
      <ul className="results">
        {results.map(({ slug, title, type, snippet, terms }) => {
          const { href } = router.buildLocation({
            to: '/content/$slug',
            params: { slug },
            search: { q: query },
          });
          return (
            <li key={slug}>
              <aside className="result-meta">
                <span className="content-type">{type === 'archived-post' ? 'Blog post' : 'Project page'}</span>
                <span>Website content</span>
              </aside>
              <div className="result-main">
                <h3>
                  <Link href={href} routerOptions={query ? { resetScroll: false } : undefined}>
                    <span><Highlight text={title} terms={terms}/></span>
                    <IconArrowTopRight width="18" height="18" aria-hidden="true"/>
                  </Link>
                </h3>
                {snippet && <p><Highlight text={snippet} terms={terms}/></p>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function toBrowseResult({ slug, title, summary, type }: PageMeta): ContentResult {
  return { slug, title, type, snippet: summary, terms: [] };
}

function toSearchResult(hit: SearchResult): ContentResult {
  const { id, title, text, summary, terms, type } = hit;
  const snippet = createSnippet(text ?? '', terms) || (summary ?? '');
  return { slug: id, title, type, snippet, terms };
}
