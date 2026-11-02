import { Link } from '@tanstack/react-router';
import type { ContentIndex } from '@globalise/content';
import './ContentIndexPage.css';

type ContentIndexPageProps = {
  pages: ContentIndex;
};

export function ContentIndexPage({ pages }: ContentIndexPageProps) {
  return (
    <div className="content-index">
      <h1>Content</h1>
      <p>{pages.length} pages</p>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.slug}>
              <td><Link to="/content/$slug" params={{ slug: page.slug }}>{page.title}</Link></td>
              <td>{page.type}</td>
              <td>{page.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
