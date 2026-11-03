import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import debounce from 'lodash/debounce';
import { Highlight } from './Highlight.tsx';
import { createSnippet } from './highlightTerms.ts';
import { useContentSearch } from './useContentSearch.ts';
import type { SearchResult } from 'minisearch';
import type { ContentIndex, PageMeta } from '@globalise/content';
import './ContentIndexPage.css';

type ContentIndexPageProps = {
  pages: ContentIndex;
};

type ContentIndexRow = Pick<PageMeta, 'slug' | 'title' | 'type' | 'status'> & {
  terms: string[];
  text?: string;
};

export function ContentIndexPage({ pages }: ContentIndexPageProps) {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useMemo(() => debounce(setQuery, 300), []);
  useEffect(() => () => setQueryDebounced.cancel(), [setQueryDebounced]);
  const contentSearch = useContentSearch();
  const rows: ContentIndexRow[] = query && contentSearch
    ? contentSearch.search(query).map(toRow)
    : pages.map((page) => ({ ...page, terms: [] }));

  return (
    <div className="content-index">
      <h1>Content</h1>
      <input
        type="search"
        placeholder="Search"
        disabled={!contentSearch}
        onChange={(event) => setQueryDebounced(event.target.value)}
      />
      <p>{rows.length} pages</p>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            {query && <th>Match</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug}>
              <td>
                <Link to="/content/$slug" params={{ slug: row.slug }}>
                  <Highlight text={row.title} terms={row.terms}/>
                </Link>
              </td>
              <td><Highlight text={row.type} terms={row.terms}/></td>
              <td><Highlight text={row.status} terms={row.terms}/></td>
              {query && (
                <td><Highlight text={createSnippet(row.text ?? '', row.terms)} terms={row.terms}/></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function toRow(hit: SearchResult): ContentIndexRow {
  const { id, title, type, status, text, terms } = hit;
  return { slug: id, title, type, status, text, terms };
}
