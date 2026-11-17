import { unified } from 'unified';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Root as HtmlRoot } from 'hast';
import type { Root as MarkdownRoot } from 'mdast';
import type { VFile } from 'vfile';

const sanitizeSchema = { ...defaultSchema, clobberPrefix: '' };

const converter = unified()
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, sanitizeSchema);

export async function convertToHtml(
  markdown: MarkdownRoot,
  source: VFile,
): Promise<HtmlRoot> {
  return converter.run(markdown, source);
}
