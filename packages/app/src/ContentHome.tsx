import { useEffect, useMemo } from 'react';
import { Link } from 'react-aria-components';
import debounce from 'lodash/debounce';
import { getRouteApi, useRouter } from '@globalise/router';
import { Highlight } from './Highlight.tsx';
import { createSnippet } from './highlightTerms.ts';
import { useContentSearchIndex } from './useContentSearchIndex.ts';
import type { SearchResult } from 'minisearch';
import type { ContentIndex, PageMeta } from '@globalise/content';
import './ContentHome.css';

const route = getRouteApi('/content/');

type ContentHomeRow = Pick<PageMeta, 'slug' | 'title' | 'type' | 'status'> & {
  terms: string[];
  text?: string;
};

export function ContentHome() {
  const pages: ContentIndex = route.useLoaderData();
  const { q } = route.useSearch();
  const router = useRouter();
  const navigate = route.useNavigate();
  const searchDebounced = useMemo(
    () => debounce((query: string) => void navigate({ search: { q: query || undefined }, replace: true }), 300),
    [navigate],
  );
  useEffect(() => () => searchDebounced.cancel(), [searchDebounced]);
  const contentSearchIndex = useContentSearchIndex();
  const rows: ContentHomeRow[] = q && contentSearchIndex
    ? contentSearchIndex.search(q).map(toRow)
    : pages.map((page) => ({ ...page, terms: [] }));

  return (
    <div className="content-home">
      <h1>Content</h1>
      <input
        type="search"
        placeholder="Search"
        defaultValue={q}
        disabled={!contentSearchIndex}
        onChange={(event) => searchDebounced(event.target.value)}
      />
      <p>{rows.length} pages</p>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            {q && <th>Match</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug}>
              <td>
                <Link href={router.buildLocation({ to: '/content/$slug', params: { slug: row.slug }, search: { q } }).href}>
                  <Highlight text={row.title} terms={row.terms}/>
                </Link>
              </td>
              <td><Highlight text={row.type} terms={row.terms}/></td>
              <td><Highlight text={row.status} terms={row.terms}/></td>
              {q && (
                <td><Highlight text={createSnippet(row.text ?? '', row.terms)} terms={row.terms}/></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function toRow(hit: SearchResult): ContentHomeRow {
  const { id, title, type, status, text, terms } = hit;
  return { slug: id, title, type, status, text, terms };
}
