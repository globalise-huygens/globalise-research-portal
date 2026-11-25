import { IconArrowTopRight, IconSearch } from '@globalise/design';
import { getRouteApi, toHref, useRouter } from '@globalise/router';
import { Button, Input, Link, SearchField } from 'react-aria-components';
import type { ContentIndex, PageMeta } from '@globalise/content';
import type { SubmitEvent } from 'react';
import type { SearchResult } from 'minisearch';
import { Highlight } from './Highlight.tsx';
import { createSnippet } from './highlightTerms.ts';
import { useContentSearchIndex } from './useContentSearchIndex.ts';
import './ContentHome.css';

const route = getRouteApi('/content/');

type ContentResult = Pick<PageMeta, 'slug' | 'title'> & {
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
        <h1>Search site content</h1>
        <form onSubmit={searchContent}>
          <SearchField
            key={q ?? ''}
            className="search-field"
            aria-label="Search site content"
            defaultValue={q ?? ''}
          >
            <Input name="q" placeholder="Search articles and project pages"/>
            <Button type="submit">
              <IconSearch width="20" height="20" aria-hidden="true"/>
              Search
            </Button>
          </SearchField>
        </form>
        <div className="links">
          <Link href={toHref({ to: '/content/blog' })}>
            Browse the blog <IconArrowTopRight width="16" height="16" aria-hidden="true"/>
          </Link>
          <Link href={toHref({ to: '/search', search: { q } })}>
            Search the archive <IconArrowTopRight width="16" height="16" aria-hidden="true"/>
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
    return <p role="status">Site content search is unavailable.</p>;
  }
  if (!searchIndex) {
    return <p role="status">Searching site content…</p>;
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
      <h2 id="content-results">
        {query ? `${results.length} ${countLabel} for “${query}”` : 'Browse site content'}
      </h2>
      <ul className="results">
        {results.map(({ slug, title, snippet, terms }) => {
          const { href } = router.buildLocation({
            to: '/content/$slug',
            params: { slug },
            search: { q: query },
          });
          return (
            <li key={slug}>
              <h3>
                <Link href={href}>
                  <span><Highlight text={title} terms={terms}/></span>
                  <IconArrowTopRight width="18" height="18" aria-hidden="true"/>
                </Link>
              </h3>
              {snippet && <p><Highlight text={snippet} terms={terms}/></p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function toBrowseResult({ slug, title, summary }: PageMeta): ContentResult {
  return { slug, title, snippet: summary, terms: [] };
}

function toSearchResult(hit: SearchResult): ContentResult {
  const { id, title, text, summary, terms } = hit;
  const snippet = createSnippet(text ?? '', terms) || (summary ?? '');
  return { slug: id, title, snippet, terms };
}
