import { useRouter } from '@globalise/router';
import { Link } from 'react-aria-components';
import type { PageMeta } from '@globalise/content';
import './BlogCards.css';

export function BlogCards({ posts }: { posts: PageMeta[] }) {
  const router = useRouter();

  return (
    <ul className="blog-cards">
      {posts.map(({ slug, title, hero }) => (
        <li key={slug}>
          <Link href={router.buildLocation({
            to: '/content/$slug',
            params: { slug },
          }).href}>
            {hero && <img src={hero.src} alt="" loading="lazy"/>}
            <div className="details">
              <span className="label">Blog post</span>
              <h2>{title}</h2>
              <span className="action" aria-hidden="true">Read post →</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
