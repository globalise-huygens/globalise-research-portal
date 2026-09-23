import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';

import type { SearchCompletionSuggestOption } from '@elastic/elasticsearch/api/types';

type AutocompleteSource = {
  type: string;
  identifier: string;
  preferredLabel: string;
  labels: string[];
};

export type AutocompleteRequest = {
  query: string;
};

export type AutocompleteSuggestion = {
  id: string;
  type: string;
  label: string;
  alternatives: string[];
};

const AutocompleteRequestSchema = z.object({
  query: z.string().min(2),
});

const autocomplete = createServerFn({ method: 'POST' })
  .validator(AutocompleteRequestSchema)
  .handler(async ({ data }): Promise<AutocompleteSuggestion[]> => {
    const result = await elastic.search<AutocompleteSource>({
      index: 'autocomplete',
      suggest: {
        suggest: {
          prefix: data.query,
          completion: {
            field: 'labels',
            size: 50,
          },
        },
      },
    });

    return (result.suggest!.suggest[0].options as SearchCompletionSuggestOption<AutocompleteSource>[]).map((hit) => ({
      id: hit._source!.identifier,
      type: hit._source!.type,
      label: hit._source!.preferredLabel,
      alternatives: hit._source!.labels.filter((label) => label !== hit._source!.preferredLabel),
    }));
  });

export default autocomplete;
