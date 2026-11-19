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

  it('connects each NER classification to its concept and distinguishes location-form subjects', () => {
    vi.mocked(useHighlightCategories).mockReturnValue(new Set());
    renderToStaticMarkup(createElement(ManifestEntityHighlightMenu));
    const categories = vi.mocked(EntityHighlightMenu).mock.lastCall?.[0].categories ?? [];
    const entries = categories.flatMap((category) =>
      category.subcategories?.length ? category.subcategories : [category],
    );
    const expected: Record<string, string> = {
      'ner:cmty_name': 'c9ab191a-f147-4e6d-aad0-cfef646f9278',
      'ner:cmty_qual': 'a3e3f6d4-f90a-4a3d-bd32-dec4ca79e713',
      'ner:cmty_quant': '958ac1ab-945b-45e6-ac01-07830f6eb750',
      'ner:date': 'a0bdd099-e91e-430b-b035-8e22d37e818f',
      'ner:doc': 'c05a9151-050e-4d47-85a8-9f0758b7556c',
      'ner:eth_rel': 'c207dd28-0b00-44b0-be2c-c810ab55fdd1',
      'ner:loc_adj': '179d998f-e0aa-41b7-ac8b-437c21d2d6de',
      'ner:loc_name': '179d998f-e0aa-41b7-ac8b-437c21d2d6de',
      'ner:org': '9046bc09-7019-4afb-9edd-7258245fcb42',
      'ner:per_attr': 'c207dd28-0b00-44b0-be2c-c810ab55fdd1',
      'ner:per_name': 'c207dd28-0b00-44b0-be2c-c810ab55fdd1',
      'ner:prf': 'c207dd28-0b00-44b0-be2c-c810ab55fdd1',
      'ner:ship': '6a88e519-f72d-4d85-8dce-13675a685048',
      'ner:ship_type': '6a88e519-f72d-4d85-8dce-13675a685048',
      'ner:status': 'c207dd28-0b00-44b0-be2c-c810ab55fdd1',
    };
    expect(entries).toHaveLength(Object.keys(expected).length);
    for (const entry of entries) {
      const id = entry.id ?? '';
      expect(entry.preview?.uri).toBe(`https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:${id.replace('ner:', '')}`);
      expect(entry.preview?.conceptUri).toBe(`https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:${expected[id]}`);
      expect(Boolean(entry.preview?.isAppellativeSubject)).toBe(id === 'ner:loc_adj');
    }

    const persons = categories.find((category) => category.id === 'persons');
    expect(persons?.preview?.conceptUri).toBeUndefined();
    expect(persons?.preview?.uri).toBe(`https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:${expected['ner:per_name']}`);
    expect(persons?.preview?.classificationIds).toContain('ner:per_name');
  });
});
