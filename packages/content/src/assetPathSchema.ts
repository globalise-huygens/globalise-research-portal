import { extname } from 'node:path';
import { z } from 'zod';
import { assetsDir } from './contentFiles.ts';

export const assetPathSchema = z.string()
  .refine(isDecodable, { error: 'not decodable', abort: true })
  .refine((path) => decodeURI(path).startsWith(`/${assetsDir}/`), 'outside the assets')
  .refine((path) => !decodeURI(path).split('/').includes('..'), 'path contains ..')
  .refine(toImageType, { error: ({ input }) => `unknown image type: ${toExtension(String(input))}` });

export function toImageType(path: string): string | undefined {
  return imageTypes.get(toExtension(path));
}

function toExtension(path: string): string {
  return extname(path).toLowerCase();
}

const imageTypes = new Map([
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
]);

function isDecodable(path: string): boolean {
  try {
    decodeURI(path);
    return true;
  } catch {
    return false;
  }
}
