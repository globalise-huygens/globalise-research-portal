import { CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { getValue, encodeEntityToken } from './entityToken';
import type { AutocompleteConfig } from './SearchFieldConfig';

export default function createEntityCompletionSource<E extends object = object>(config: AutocompleteConfig<E>) {
  return async (context: CompletionContext): Promise<CompletionResult | null> => {
    try {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit))
      {return null;}

      if (config.debounceMs && config.debounceMs > 0) {
        await wait(config.debounceMs, context);
        if (context.aborted)
        {return null;}
      }

      const search = word.text.trim();
      if ((config.minimumChars && search.length < config.minimumChars))
      {return null;}

      const entities = await config.source(search);
      if (context.aborted)
      {return null;}

      return {
        filter: false,
        from: word.from,
        options: entities.map((entity) => ({
          type: 'property',
          label: getValue(entity, config.label),
          detail: getValue(entity, config.description),
          apply: encodeEntityToken(entity, config),
          entity,
        })),
      };
    } catch {
      return null;
    }
  };
}

function wait(ms: number, context: CompletionContext): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!context.aborted)
      {resolve();}
    }, ms);
  });
}
