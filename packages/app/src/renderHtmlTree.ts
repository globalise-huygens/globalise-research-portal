import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import type { ReactNode } from 'react';
import type { Root } from 'hast';

export function renderHtmlTree(tree: Root): ReactNode {
  return toJsxRuntime(tree, { Fragment, jsx, jsxs }) as ReactNode;
}
