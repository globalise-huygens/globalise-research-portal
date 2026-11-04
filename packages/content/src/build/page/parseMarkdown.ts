import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

const parser = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm);

export function parseMarkdown(source: VFile): Root {
  return parser.parse(source);
}
