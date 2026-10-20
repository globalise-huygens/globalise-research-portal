import { Id } from './Id';

export type Offsets = {
  start: number;
  end: number;
};

export type WordOffsets = Offsets & {
  id: Id;
};

export function findWordsByOffsets(
  words: WordOffsets[],
  offsets: Offsets,
): Id[] {
  return words
    .filter((word) => word.start < offsets.end && offsets.start < word.end)
    .map((word) => word.id);
}
