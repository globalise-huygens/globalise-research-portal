import { extname } from 'node:path';
import { createServerOnlyFn } from '@tanstack/react-start';
import { assetsDir } from '../contentFiles.ts';
import { readContentAsset } from './readContentFile.server.ts';

const imageTypes = new Map([
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
]);

export const getContentAsset = createServerOnlyFn(async (pathname: string): Promise<Response | undefined> => {
  const contentType = imageTypes.get(extname(pathname).toLowerCase());
  const isAsset = pathname.startsWith(`/${assetsDir}/`) && !pathname.includes('..');
  if (!isAsset || !contentType) {
    return undefined;
  }
  try {
    const asset = await readContentAsset(decodeURI(pathname));
    return new Response(asset, {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=300' },
    });
  } catch {
    return undefined;
  }
});
