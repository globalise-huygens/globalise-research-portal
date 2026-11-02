import { renderHtmlTree } from './renderHtmlTree.ts';
import type { ContentPage } from '@globalise/content';
import './ContentPageView.css';

type ContentPageViewProps = {
  page: ContentPage;
};

export function ContentPageView({ page }: ContentPageViewProps) {
  const htmlTree = page.htmlTree;
  return (
    <article className="content-page">
      {renderHtmlTree(htmlTree)}
    </article>
  );
}
