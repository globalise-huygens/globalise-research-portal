import { useRouter } from '@globalise/router';
import { IconArrowTopRight } from '@globalise/design';
import { Link } from 'react-aria-components';
import type { BlogPostMeta } from './blogPost.ts';
import './BlogCards.css';

export function BlogCards({
  posts,
  heading: Heading = 'h2',
}: {
  posts: BlogPostMeta[];
  heading?: 'h2' | 'h3';
}) {
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
              <Heading>{title}</Heading>
              <span className="action" aria-hidden="true">
                Read post <IconArrowTopRight width="16" height="16"/>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
