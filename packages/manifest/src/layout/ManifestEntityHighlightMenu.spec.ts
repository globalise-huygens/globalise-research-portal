import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cidocEntityClassificationIds,
  eventCategory,
} from '@globalise/common/annotation';
import {
  setHighlightCategories,
  useHighlightCategories,
} from '@globalise/common/document';
import { EntityHighlightMenu } from './EntityHighlightMenu';
import { ManifestEntityHighlightMenu } from './ManifestEntityHighlightMenu';

vi.mock('@globalise/common/document', () => ({
  setHighlightCategories: vi.fn(),
  useHighlightCategories: vi.fn(),
}));

vi.mock('./EntityHighlightMenu', () => ({
  EntityHighlightMenu: vi.fn(() => null),
}));

describe('ManifestEntityHighlightMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes only entity selections to the menu, including when only events are enabled', () => {
    vi.mocked(useHighlightCategories).mockReturnValue(
      new Set([...cidocEntityClassificationIds, eventCategory]),
    );
    renderToStaticMarkup(createElement(ManifestEntityHighlightMenu));
    expect(vi.mocked(EntityHighlightMenu).mock.lastCall?.[0].selectedKeys)
      .toEqual(new Set(cidocEntityClassificationIds));

    vi.mocked(useHighlightCategories).mockReturnValue(new Set([eventCategory]));
    renderToStaticMarkup(createElement(ManifestEntityHighlightMenu));
    expect(vi.mocked(EntityHighlightMenu).mock.lastCall?.[0].selectedKeys)
      .toEqual(new Set());
  });

  it('preserves event highlights when changing entity selections', () => {
    vi.mocked(useHighlightCategories).mockReturnValue(
      new Set([...cidocEntityClassificationIds, eventCategory]),
    );
    renderToStaticMarkup(createElement(ManifestEntityHighlightMenu));
    const props = vi.mocked(EntityHighlightMenu).mock.lastCall?.[0];
    expect(props).toBeDefined();

    props?.onSelectedKeysChange(new Set());
    expect(setHighlightCategories).toHaveBeenLastCalledWith(new Set([eventCategory]));

    props?.onSelectedKeysChange((current) => {
      current.delete(cidocEntityClassificationIds[0]);
      return current;
    });
    expect(setHighlightCategories).toHaveBeenLastCalledWith(
      new Set([...cidocEntityClassificationIds.slice(1), eventCategory]),
    );
  });
});
