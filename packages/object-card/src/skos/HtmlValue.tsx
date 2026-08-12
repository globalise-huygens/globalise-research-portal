import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt('zero', {
  html: false,
  breaks: true,
  linkify: false,
});

markdown.enable(['emphasis', 'newline']);

type HtmlValueProps = {
  value: string;
};

export function renderMarkdown(value: string): string {
  const html = markdown.renderInline(value);
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['em', 'br'],
    ALLOWED_ATTR: [],
  });
}

export function HtmlValue({ value }: HtmlValueProps) {
  return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />;
}
