import type {
  FullTextSearchBody,
  SearchResult,
} from '@globalise/common/document';

type SearchResultsMock = {
  manifestId: string;
  results: SearchResult<FullTextSearchBody>[];
};

/**
 * Dummy search results for https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json
 */
export const dummySearchResults: SearchResultsMock = {
  'manifestId': 'https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json',
  'results': [
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      'position': {
        'start': 107,
        'end': 116,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-0',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'lheid. Den Hoog Edelen Groot Agtbaeren, [Gestrenge]n, wijdgebiedende, Heere! M„r Willem Arn',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      'position': {
        'start': 211,
        'end': 220,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-1',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'verneur Generaal Benevens: De wel Edele [Gestrenge] Heeren Raaden van Nederlandsch Indië Ho',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      'position': {
        'start': 282,
        'end': 291,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-2',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'erlandsch Indië HoogEdele Groot Agtbare [Gestrenge] wijdgebiedende Heer, en WelEdele Gestre',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      'position': {
        'start': 325,
        'end': 334,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-3',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'trenge wijdgebiedende Heer, en WelEdele [Gestrenge] Heeren. Ons na den anderen zo in Origin',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      'position': {
        'start': 108,
        'end': 117,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-0',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'elheid Den Hoog Edelen Groot Agtbaeren, [Gestrenge]n, wijdgebiedende, Heere! M„r Willem Arn',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      'position': {
        'start': 211,
        'end': 220,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-1',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'uverneur Generaal Benevens De wel Edele [Gestrenge] Heeren Raaden van Nederlandsch Indië Ho',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      'position': {
        'start': 283,
        'end': 292,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-2',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'rlandsch Indië Hoog Edele Groot Agtbare [Gestrenge] wijdgebiedende Heere, en WelEdele Gestr',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      'position': {
        'start': 327,
        'end': 336,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-3',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'renge wijdgebiedende Heere, en WelEdele [Gestrenge]n Heeren Ons na den anderen zo in Origin',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42',
      'position': {
        'start': 549,
        'end': 558,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42#search-0',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': '/:onderstond:/ Hoog Edele Groot Agtbare [Gestrenge] wijd gebiedende, Heere en welEdele Gest',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42',
      'position': {
        'start': 594,
        'end': 603,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42#search-1',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'enge wijd gebiedende, Heere en welEdele [Gestrenge] Heeren /:lager:/ uw Hoog Edelheedens On',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43',
      'position': {
        'start': 81,
        'end': 90,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43#search-0',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'elheijd Den Hoog Edelen Groot Agtbaaren [Gestrenge] wijdgebiedende Heere M:r Willem Arnold',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43',
      'position': {
        'start': 179,
        'end': 188,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43#search-1',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'uverneur Generaal Benevens De Wel Edele [Gestrenge] Heeren Raaden van Nederlands India Hoog',
      },
    },
    {
      'canvasId': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43',
      'position': {
        'start': 296,
        'end': 305,
      },
      'body': {
        'id': 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43#search-2',
        'type': 'full-text',
        'term': 'Gestrenge',
        'snippet': 'enge Wijdgebiedende Heere en Wel Edele: [Gestrenge] Heeren Door de Burgers: Kroekwits en Ro',
      },
    },
  ],
};
