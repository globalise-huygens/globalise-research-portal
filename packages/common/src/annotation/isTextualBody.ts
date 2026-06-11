import { TextualBody } from './AnnoModel';

export const isTextualBody = (body?: unknown): body is TextualBody => {
  const typed = body as Partial<TextualBody> | undefined;
  return !!typed
    && typed.type === 'TextualBody'
    && typeof typed.value === 'string';
};