import { SpecificResourceTarget } from './AnnoModel';

export const isSpecificResourceTarget = (
  target?: unknown,
): target is SpecificResourceTarget => {
  const typed = target as Partial<SpecificResourceTarget> | undefined;
  return !!typed
    && typed.type === 'SpecificResource'
    && !!typed.source
    && !!typed.selector;
};