import { describe, expect, it, vi } from 'vitest';
import { calculateHtrOffsets } from './calculateHtrOffsets';
import { selectTextRangeMappings } from './selectTextRangeMappings.server';

const document = 'NL-HaNA_1.04.02_1053_0003-0071';
const esUrl = 'https://search.globalise.huygens.knaw.nl/documents/_search';
const dbUrl = new URL('../../../../data/document-text-mappings.db', import.meta.url);
const transcriptionsUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/annotations:transcriptions:NL-HaNA_1.04.02_';

type EsResponse = { hits: { hits: { _source: { text: string } }[] } };
type AnnotationPage = { items: { id: string; body: { value: string }[] }[] };

describe(`${calculateHtrOffsets.name} using ${document}`, () => {
  it('maps a hit on the first line of the first page onto its htr text', async () => {
    vi.stubEnv('DOCUMENT_TEXT_MAPPINGS_DB', dbUrl.pathname);
    const page = '1053_0003';
    const normalized = (await fetchNormalizedTextFromEs(document)).slice(0, 100);
    const htr = (await fetchHtrTextFromTranscriptionPage(page)).slice(0, 100);
    const docMappings = selectTextRangeMappings(document);

    const line1Hit = 'december';
    const start = normalized.indexOf(line1Hit);
    const relevantMappings = docMappings.slice(0,2);
    const htrOffsets = calculateHtrOffsets({ start, end: start + line1Hit.length }, relevantMappings);
    const result = htrOffsets.map(({ start, end }) => htr.slice(start, end));

    const line2Hit = 'Naermiddaechs';
    const start2 = normalized.indexOf(line2Hit);
    const htrOffsets2 = calculateHtrOffsets({ start: start2, end: start2 + line2Hit.length }, relevantMappings);
    const result2 = htrOffsets2.map(({ start, end }) => htr.slice(start, end));

    const [firstMapping, secondMapping] = relevantMappings;
    const firstPart = normalized.slice(firstMapping.normalizedFrom, firstMapping.normalizedTo);
    const secondPart = normalized.slice(secondMapping.normalizedFrom, secondMapping.normalizedTo);
    const gap = '#'.repeat(secondMapping.htrPageOffset - firstMapping.htrPageOffset - firstPart.length);
    const htrFromNormalized = firstPart + gap + secondPart;
    const normalizedRanges = relevantMappings.map((m) => normalized.slice(m.normalizedFrom, m.normalizedTo));

    const alignNl = (text: string) => text.replace(/\n/g, '⏎');

    console.log(JSON.stringify({
      htr: alignNl(htr),
      page,
      normalized: alignNl(normalized),
      normalizedRanges: normalizedRanges.map(alignNl),
      htrFromNormalized: alignNl(htrFromNormalized),
      relevantMappings: relevantMappings,
      hit: line1Hit,
      start,
      htrOffsets,
      result,
      hit2: line2Hit,
      start2,
      htrOffsets2,
      result2,
    }, null, 2));

    expect(result).toEqual([line1Hit]);
    expect(result2).toEqual([line2Hit]);
  });
});

async function fetchNormalizedTextFromEs(name: string): Promise<string> {
  const response = await fetch(esUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ size: 1, _source: ['text'], query: { term: { name } } }),
  });
  const result = await response.json() as EsResponse;
  return result.hits.hits[0]._source.text;
}

async function fetchHtrTextFromTranscriptionPage(page: string): Promise<string> {
  const response = await fetch(transcriptionsUrl + page);
  const annotationPage = await response.json() as AnnotationPage;
  const pageHtr = annotationPage.items.find((item) => item.id.endsWith('#page-htr'));
  return pageHtr?.body[0].value ?? '';
}
