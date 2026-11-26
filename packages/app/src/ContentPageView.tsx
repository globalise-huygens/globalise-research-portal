import { useRef } from 'react';
import { isBlogPost } from './blogPost.ts';
import type { BlogPostMeta } from './blogPost.ts';
import { BlogPostView } from './BlogPostView.tsx';
import { renderHtmlTree } from './renderHtmlTree.ts';
import { useQueryHighlight } from './useQueryHighlight.ts';
import type { ContentPage } from '@globalise/content';
import './ContentPageView.css';

type ContentPageViewProps = {
  page: ContentPage;
  query?: string;
  relatedPosts: BlogPostMeta[];
};

export function ContentPageView({
  page,
  query,
  relatedPosts,
}: ContentPageViewProps) {
  const articleRef = useRef<HTMLElement>(null);
  useQueryHighlight(articleRef, page.tree, query);

  if (isBlogPost(page.meta)) {
    return (
      <BlogPostView
        meta={page.meta}
        tree={page.tree}
        query={query}
        relatedPosts={relatedPosts}
      />
    );
  }

  return (
    <article ref={articleRef} className="content-page">
      {renderHtmlTree(page.tree)}
    </article>
  );
}
