import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { facets } from './elastic.server';

import type { EntityTagType } from '@globalise/design';

export type SearchRequest = {
  query: string;
  facets: Record<string, string[]>;
  offset?: number;
  limit?: number;
};

export type SearchResult = {
  id: string;
  type: EntityTagType;
  title: string;
};

export type DocumentSearchResult = SearchResult & {
  type: 'document';
  archive: string[];
  text: string;
  observances: {
    type: EntityTagType;
    observedText: string;
    from: number,
    to: number,
    id: string;
  }[];
};

const SearchRequestSchema = z.object({
  query: z.string(),
  facets: z.record(z.string(), z.array(z.string())).refine(
    (record) => Object.keys(record).every((key) => Object.keys(facets).includes(key)),
    { error: 'Invalid facet key applied!' },
  ),
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).optional(),
});

const search = createServerFn({ method: 'POST' })
  .validator(SearchRequestSchema)
  .handler(({ data }): SearchResult[] => [...Array(data.limit ?? 10).keys()].map((i) => ({
    id: ((data.offset ?? 0) + i + 1).toString(),
    type: 'document',
    title: 'Vier copie missiven [door Jacques l\'Hermite?] uijt Bantam, respectievelijk aan Albert Willemsz., coopman in Atchin, aan Pieter Gerritsz. Borgonje tot Tierepopelier, aan Johan van Wesik (benoemd tot gouverneur van de custe Chormandel) en aan Hans Marcelis tot Palicatte, alle in dato 12 December 1610.',
    archive: [
      'NL-HaNA 1.04.02',
      'Deel I Heren Zeventien en kamer Amsterdam',
      'Deel I/E INGEKOMEN STUKKEN UIT INDIË',
      'Deel I/E.5 Overgekomen brieven en papieren',
      'Deel I/E.5.a Overgekomen brieven en papieren uit Indië aan de Heren XVII en de kamer Amsterdam',
      '1053-1055 Overgekomen brieven en papieren uit Indië aan de Heren XVII en de kamer Amsterdam. Met inhoudsopgaven',
      '1053 Stukken betreffende de Molukken, Banda, Ambon, Bantam, Makassar en Gresik',
    ],
    text: 'Dag register der daagelijxe voor vallen gehouden, toot Casteel, de Poedes hoop d\' Ao 1688. \\nDag Register van \\nde daaglijxe voorvallen gehouden binnen \'t Casteel de goede hoop, ancabo de boa Esperance, sedert p=ro Januarij 1688, tot ultimo decembris desselvigen Jaars Januarij 1688. donderdag primo d„o, het oude Iaar gelukkig afgeleid— en het niuwe angetreden zijnde, heeft d\' E. H„r Commend„r na ontfangene plegtig: heden van geluktvensingh, met betuijingh van schuldige eerbiedenis aller hoge en lage Officieren, de leden sijns Agtb: Raads, tot onderlinge lievde en eendraght ernstelijk vermaand, en ter vergadering am sijn handen den eed van getrouwigheid, den nieuw: verkosen burger-Raad, en de Officieren der burgerie doen afleggen; werdende \\nJanuarij In\'t Casteel de goedehoop, 1682: \\nde Commissarissen der Collegien, so van weesmeest=r als huwelijxe en kleine sake in hun bediening gecontinueerd:s waar na hier ten Castele vande Puije dit volgende geeneraal placcat afgelesen en ter behoorlijker plaats angeslagen Simon vander Stal Commend„r wegens de generale ned landsche geoctroijeerde Oostindische ma Comp„e over desselvs Casteel en onderhorige plaatsen an Cabode goede hoop mitsgaders doen te weten Also wij bevonden hebben t\'onser leet. wesen dat eenige der placcaten Ordonna tien en statuten bij de opperhoofden dese Commendements onse voorsaten en onlangs bij ons selvs tot welstand en bevordering deser Colonie en desselvs ingesetenen van \\nJanuarij 1688.',
    observances: [
      {
        'type': 'Place',
        'observedText': 'Poedes hoop',
        'from': 67,
        'to': 78,
        'id': 'GLOB_479',
      },
      {
        'type': 'Place',
        'observedText': 'Casteel de goede hoop',
        'from': 153,
        'to': 174,
        'id': 'GLOB_839',
      },
      {
        'type': 'Place',
        'observedText': 'ancabo de boa Esperance',
        'from': 176,
        'to': 199,
        'id': 'GLOB_479',
      },
    ],
  })));

export default search;
