import { createServerOnlyFn } from '@tanstack/react-start';
import { assetPathSchema } from '../assetPathSchema.ts';
import { readContentAsset } from './readContentFile.server.ts';

export const getContentAsset = createServerOnlyFn(async (pathname: string): Promise<Response | undefined> => {
  const asset = assetPathSchema.safeParse(pathname);
  if (!asset.success) {
    return undefined;
  }
  try {
    const { path, contentType } = asset.data;
    return new Response(await readContentAsset(path), {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=300' },
    });
  } catch {
    return undefined;
  }
});
