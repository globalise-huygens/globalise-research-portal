import { extname } from 'node:path';
import { z } from 'zod';
import { assetsDir } from './contentFiles.ts';

export const assetPathSchema = z.string()
  .refine(isDecodable, 'not decodable')
  .transform(decodeURI)
  .refine((path) => path.startsWith(`/${assetsDir}/`), 'outside the assets')
  .refine((path) => !path.split('/').includes('..'), 'path contains ..')
  .transform((path, ctx) => {
    const extension = extname(path).toLowerCase();
    const contentType = imageTypes.get(extension);
    if (!contentType) {
      ctx.issues.push({ code: 'custom', message: `unknown image type: ${extension}`, input: path });
      return z.NEVER;
    }
    return { path, contentType };
  });

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
