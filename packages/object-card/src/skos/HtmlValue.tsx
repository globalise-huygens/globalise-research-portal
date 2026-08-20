import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt('zero', {
  breaks: true,
  html: false,
  linkify: true,
});

markdown.enable(['emphasis', 'link', 'linkify', 'newline']);
markdown.renderer.rules.strong_open = () => '';
markdown.renderer.rules.strong_close = () => '';

type HtmlValueProps = {
  value: string;
};

export function renderMarkdown(value: string): string {
  return markdown.renderInline(value);
}

export function HtmlValue({ value }: HtmlValueProps) {
  return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />;
}
