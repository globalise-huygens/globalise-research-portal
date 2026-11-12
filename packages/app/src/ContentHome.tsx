import { Link } from 'react-aria-components';
import { getRouteApi, useRouter } from '@globalise/router';
import type { ContentIndex } from '@globalise/content';
import './ContentHome.css';

const route = getRouteApi('/content/');

export function ContentHome() {
  const pages: ContentIndex = route.useLoaderData();
  const router = useRouter();

  return (
    <div className="content-home">
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
              <td>
                <Link href={router.buildLocation({ to: '/content/$slug', params: { slug: page.slug } }).href}>
                  {page.title}
                </Link>
              </td>
              <td>{page.type}</td>
              <td>{page.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
