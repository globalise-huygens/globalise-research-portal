import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { searchIndexFile } from '../contentFiles.ts';
import { readContentFile } from './readContentFile.server.ts';

export const getContentSearchIndexServer = createServerFn({ method: 'GET' })
  .handler((): Promise<string> => {
    setResponseHeader('Cache-Control', 'public, max-age=300');
    return readContentFile(searchIndexFile);
  });
