import { createServerOnlyFn } from '@tanstack/react-start';
import { assetPathSchema, toImageType } from '../assetPathSchema.ts';
import { readContentAsset } from './readContentFile.server.ts';

export const getContentAsset = createServerOnlyFn(async (pathname: string): Promise<Response | undefined> => {
  const contentType = toImageType(pathname);
  if (!assetPathSchema.safeParse(pathname).success || !contentType) {
    return undefined;
  }
  try {
    return new Response(await readContentAsset(decodeURI(pathname)), {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=300' },
    });
  } catch {
    return undefined;
  }
});
