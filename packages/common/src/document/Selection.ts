import { Id } from '../annotation';

export type Selection =
  | { type: 'word'; id: Id; block?: Id }
  | { type: 'classified'; id: Id; words: Id[]; block?: Id }
  | { type: 'block'; id: Id };
