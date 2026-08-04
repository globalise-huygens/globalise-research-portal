import type {
  FullTextSearchBody,
  SearchResult,
} from '@globalise/common/document';

type SearchResultsMock = {
  manifestId: string;
  results: SearchResult<FullTextSearchBody>[];
};

/**
 * Mock search results for https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json
 */
export const mockSearchResults: SearchResultsMock = {
  manifestId: 'https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json',
  results: [
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      position: {
        start: 107,
        end: 116,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'lheid. Den Hoog Edelen Groot Agtbaeren, [Gestrenge]n, wijdgebiedende, Heere! M„r Willem Arn',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      position: {
        start: 211,
        end: 220,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'verneur Generaal Benevens: De wel Edele [Gestrenge] Heeren Raaden van Nederlandsch Indië Ho',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      position: {
        start: 282,
        end: 291,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'erlandsch Indië HoogEdele Groot Agtbare [Gestrenge] wijdgebiedende Heer, en WelEdele Gestre',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13',
      position: {
        start: 325,
        end: 334,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p13#search-3',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'trenge wijdgebiedende Heer, en WelEdele [Gestrenge] Heeren. Ons na den anderen zo in Origin',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      position: {
        start: 108,
        end: 117,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'elheid Den Hoog Edelen Groot Agtbaeren, [Gestrenge]n, wijdgebiedende, Heere! M„r Willem Arn',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      position: {
        start: 211,
        end: 220,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'uverneur Generaal Benevens De wel Edele [Gestrenge] Heeren Raaden van Nederlandsch Indië Ho',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      position: {
        start: 283,
        end: 292,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'rlandsch Indië Hoog Edele Groot Agtbare [Gestrenge] wijdgebiedende Heere, en WelEdele Gestr',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15',
      position: {
        start: 327,
        end: 336,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p15#search-3',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'renge wijdgebiedende Heere, en WelEdele [Gestrenge]n Heeren Ons na den anderen zo in Origin',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42',
      position: {
        start: 549,
        end: 558,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: '/:onderstond:/ Hoog Edele Groot Agtbare [Gestrenge] wijd gebiedende, Heere en welEdele Gest',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42',
      position: {
        start: 594,
        end: 603,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p42#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'enge wijd gebiedende, Heere en welEdele [Gestrenge] Heeren /:lager:/ uw Hoog Edelheedens On',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43',
      position: {
        start: 81,
        end: 90,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'elheijd Den Hoog Edelen Groot Agtbaaren [Gestrenge] wijdgebiedende Heere M:r Willem Arnold',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43',
      position: {
        start: 179,
        end: 188,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'uverneur Generaal Benevens De Wel Edele [Gestrenge] Heeren Raaden van Nederlands India Hoog',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43',
      position: {
        start: 296,
        end: 305,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p43#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'enge Wijdgebiedende Heere en Wel Edele: [Gestrenge] Heeren Door de Burgers: Kroekwits en Ro',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p101',
      position: {
        start: 765,
        end: 774,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p101#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'renge wijdgebiedende Heere en wel Edele [Gestrenge] Heeren /:Lager/ uw Hoog Edelheedens ond',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p935',
      position: {
        start: 258,
        end: 267,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p935#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'ch Jndie etc:a a etc:a ec:a Hoog Edelen [Gestrenge]n, Hoog Achtbaaren en Wijdgebiedenden He',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p941',
      position: {
        start: 364,
        end: 373,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p941#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'van zijn Hoog Edelheid Den Hoog Edelen [Gestrenge]n Hoog Achtbaeren en Wijdgebieder den He',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p941',
      position: {
        start: 479,
        end: 488,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p941#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'erneur Generaal, beneevens de Wel Edele [Gestrenge] Heeren Raaden Van Nederlandsch Jndie &:',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p939',
      position: {
        start: 362,
        end: 371,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p939#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'van zijn Hoog Edelheid Den Hoog Edelen [Gestrenge]n Hoog Achtbaeren en Wijdgebiederden Hee',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p939',
      position: {
        start: 476,
        end: 485,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p939#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'erneur Generaal, beneevens de Wel Edele [Gestrenge] Heeren Raaden van Nederlandsch Jndie &:',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p943',
      position: {
        start: 364,
        end: 373,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p943#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'van zijn Hoog Edelheid Den Hoog Edelen [Gestrenge]n Hoog Achtbaeren en Wijdgebieder den He',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p943',
      position: {
        start: 479,
        end: 488,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p943#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'erneur Generaal, beneevens de Wel Edele [Gestrenge] Heeren Raaden Van Nederlandsch Jndie &:',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p949',
      position: {
        start: 799,
        end: 808,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p949#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'en Wijdgebieden den Heere en Wel Edele [Gestrenge] Heeren /:Lager:/ UWe Hoog Edelheedens z',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958',
      position: {
        start: 80,
        end: 89,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'Aan zijn Hoog Edelheid Der Hoog Edelen [Gestrenge]n Hoog Achtbaaren en Wijdgebiedenden Hee',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958',
      position: {
        start: 199,
        end: 208,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'uverneur Generaal benevens de Wel Edele [Gestrenge] Heeren Raaden van Nederlands Jadia &a:',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958',
      position: {
        start: 269,
        end: 278,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'derlands Jadia &a: &:m: &a: Hoog Edelen [Gestrenge]n, Hoog Achtbaeren en Wijdgebiederden He',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958',
      position: {
        start: 332,
        end: 341,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p958#search-3',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'eren en Wijdgebiederden Heere Wel Edele [Gestrenge] Heeren! schuldpligtig gebruken wij de V',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p959',
      position: {
        start: 940,
        end: 949,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p959#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'nderteekenen /:onderstond:/ Hoog Edelen [Gestrenge]n, Hoog Achtbaeren Wijdgebieder der Heer',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p959',
      position: {
        start: 1004,
        end: 1013,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p959#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'ren Wijdgebieder der Heere en Wel Edele [Gestrenge] Hee„ ren /:Lager:/ UWE: Hoog Edelheeden',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p961',
      position: {
        start: 207,
        end: 216,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p961#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'erneur Generaal, beneevens De Wel Edele [Gestrenge] Heeren Raaden a Van Nederlands Jndia &:',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p961',
      position: {
        start: 278,
        end: 287,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p961#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'ederlands Jndia &:a &:a &a. Hoog Edelen [Gestrenge]n Hoog Achtbaren en Wijdgebiedenden Heer',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p961',
      position: {
        start: 339,
        end: 348,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p961#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'aren en Wijdgebiedenden Heere Wel Edele [Gestrenge] Heeren! Het gepaste aandoening uijt UWe',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p962',
      position: {
        start: 959,
        end: 968,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p962#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'ubsigneeren. /:onderstond:/ Hoog Edelen [Gestrenge]n Hoog Agtbaren Wijdgebiedenden Heere en',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p962',
      position: {
        start: 1019,
        end: 1028,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p962#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'aren Wijdgebiedenden Heere en Wel Edele [Gestrenge] Heeren /:Lager:/ Uwe Hoog Edelheedens z',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967',
      position: {
        start: 87,
        end: 96,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'Aan zijn Hoog Edelheijd Den Hoog Edelen [Gestrenge]n Hoog Achtbaeren en Wijdge„ bieden den',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967',
      position: {
        start: 210,
        end: 219,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'verneur Generaal bereevens De Wel Edele [Gestrenge] Heeren Raaden van Nederlands Jndie &ca',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967',
      position: {
        start: 283,
        end: 292,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'lands Jndie &ca &:a H:a &:n Hoog Edelen [Gestrenge]n Hoog Agtbaeren en Wijs„ gebiedenden He',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967',
      position: {
        start: 348,
        end: 357,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p967#search-3',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'en Wijs„ gebiedenden Heere 1 Wel Edele [Gestrenge] Heeren. Eerbiedig beantwoordende uw Hoo',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p977',
      position: {
        start: 379,
        end: 388,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p977#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'n zijn Hoog Edelheijd E Den Hoog Edelen [Gestrenge]n Hoog Agtbaaren en Wijdgebiedenden Heer',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p977',
      position: {
        start: 499,
        end: 508,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p977#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'rneur Generaal, bene„ vers de Wel Edele [Gestrenge] Heeren Raader Van Neder„ lands Indie &:',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p987',
      position: {
        start: 575,
        end: 584,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p987#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'ƒ teekenen. /:onderstond:/ Hoog Edelen [Gestrenge]n Hoog Agtbaeren, en Wijdgebiedenden Hee',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p987',
      position: {
        start: 641,
        end: 650,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p987#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'en Wijdgebiedenden Heeree 79 Wel Edele [Gestrenge] Heeren /:Lager:/ UWe Hoog Edelheedens z',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005',
      position: {
        start: 127,
        end: 136,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'Aan zijn Hoog Edelheijd Den Hoog Edele [Gestrenge] Groot Agtbaere wijdgebiedende Heere M„r',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005',
      position: {
        start: 240,
        end: 249,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'uverneur Generaal Benevens De Wel Edele [Gestrenge] Heeren, Raaden van Nederlands Jndië! Ho',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005',
      position: {
        start: 298,
        end: 307,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'Raaden van Nederlands Jndië! Hoog Edele [Gestrenge] Groot Agtbaere wijdgeliedende Heere d e',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005',
      position: {
        start: 359,
        end: 368,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1005#search-3',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'ere wijdgeliedende Heere d en Wel Edele [Gestrenge] Heeren. Op den 20. Junij J=o weeken de',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003',
      position: {
        start: 118,
        end: 127,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 't Aan zijn Hoog Edelheijd en Hoog Edele [Gestrenge] Groot Agtbaere Wijdgebiedende Heere M„r',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003',
      position: {
        start: 231,
        end: 240,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'uverneur Generaal Benevens De Wel Edele [Gestrenge] Heeren, Raaden van Nederlands Jndië! Ho',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003',
      position: {
        start: 289,
        end: 298,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003#search-2',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'Raaden van Nederlands Jndië! Hoog Edele [Gestrenge] Groot Agtbaere Wijdgeliedende Heere d e',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003',
      position: {
        start: 351,
        end: 360,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1003#search-3',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 're Wijdgeliedende Heere d en WWel Edele [Gestrenge] Heeren. Op den 20. Junij J=o weeken de',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1048',
      position: {
        start: 243,
        end: 252,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1048#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'derschrijven. /:onderstond:/ Hoog Edele [gestrenge] groot Agt„ ƒ J =baere wijdgebiedende He',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1056',
      position: {
        start: 423,
        end: 432,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1056#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'wijd ge„ =biedende Heere, en Wel Edele [gestrenge] Heeren /:Lager/ uW Hoog Edelheedens, on',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1053',
      position: {
        start: 145,
        end: 154,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1053#search-0',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'uverneur Generaal Benevens De Wel Edele [gestrenge] Heeren Raaden van Nederlands Jndia Hoog',
      },
    },
    {
      canvasId: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1053',
      position: {
        start: 250,
        end: 259,
      },
      body: {
        id: 'https://data.globalise.huygens.knaw.nl/manifests/inventories/3598.json/canvas/p1053#search-1',
        type: 'full-text',
        term: 'Gestrenge',
        snippet: 'baere Wijdgebiedende Heere En Wel Edele [gestrenge] Heeren \'s scheepje D\' Hoop die wij ditm',
      },
    },
  ],
};
