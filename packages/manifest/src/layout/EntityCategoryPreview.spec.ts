import { createElement, type ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PopoverCard } from '@globalise/design';
import { describe, expect, it, vi } from 'vitest';
import { EntityCategoryPreview } from './EntityCategoryPreview';

vi.mock('@globalise/design', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@globalise/design')>();
  return {
    ...actual,
    PopoverCard: ({ children, renderTrigger }: ComponentProps<typeof PopoverCard>) =>
      createElement('div', null, renderTrigger?.({}), children),
  };
});

describe('EntityCategoryPreview', () => {
  it('links the NER card and appellative subject concept using resolved labels', () => {
    const uri = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:loc_adj';
    const conceptUri = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:179d998f-e0aa-41b7-ac8b-437c21d2d6de';
    const nerUri = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:ner';
    const client = new QueryClient();
    client.setQueryData(['entity-resource', uri], {
      id: uri,
      type: 'Concept',
      _label: 'Do not use this label',
      prefLabel: [{ '@language': 'en', '@value': 'Derived location form' }],
      definition: [{ '@language': 'en', '@value': 'A form derived from a place name.' }],
      broader: [{ id: nerUri, type: 'Concept', _label: 'Do not use this broader label' }],
    });
    client.setQueryData(['entity-resource', conceptUri], {
      id: conceptUri,
      type: 'Concept',
      prefLabel: [{ '@language': 'en', '@value': 'Place' }],
    });
    client.setQueryData(['entity-resource', nerUri], {
      id: nerUri,
      type: 'Concept',
      prefLabel: [{ '@language': 'en', '@value': 'NER tags' }],
    });

    const markup = renderToStaticMarkup(createElement(
      QueryClientProvider,
      { client },
      createElement(EntityCategoryPreview, {
        data: { uri, conceptUri, isAppellativeSubject: true },
        label: 'Location form',
        children: () => createElement('button', null, 'Info'),
      }),
    ));

    expect(markup).toContain('Derived location form');
    expect(markup).toContain('A form derived from a place name.');
    expect(markup).toContain('Appellative subject concept');
    expect(markup).toContain('Place');
    expect(markup).toContain(encodeURIComponent(uri));
    expect(markup).toContain(encodeURIComponent(conceptUri));
    expect(markup).toContain(encodeURIComponent(nerUri));
    expect(markup).not.toContain('Do not use this label');
  });

  it('keeps the URI clickable when concept details cannot be resolved', () => {
    const uri = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:missing';
    const client = new QueryClient();
    client.setQueryData(['entity-resource', uri], null);

    const markup = renderToStaticMarkup(createElement(
      QueryClientProvider,
      { client },
      createElement(EntityCategoryPreview, {
        data: { uri },
        label: 'Missing category',
        children: () => createElement('button', null, 'Info'),
      }),
    ));

    expect(markup).toContain('Unable to load concept details.');
    expect(markup).toContain(encodeURIComponent(uri));
  });
});
