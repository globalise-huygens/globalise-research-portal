import type { CidocEntityClassificationId } from '@globalise/common/annotation';
import { thesaurusBase } from '@globalise/common/uri';

const conceptIds: Record<CidocEntityClassificationId, string> = {
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

export function getEntityCategoryConceptUri(id: CidocEntityClassificationId) {
  return `${thesaurusBase}${conceptIds[id]}`;
}
