import { createFileRoute } from '@tanstack/react-router';
import { createObjectCardSplat, parseObjectCardSplat } from '@globalise/common/uri';

export const Route = createFileRoute('/hdl:20.500.14722/$')({

  /**
   * See also: ./inventory:{$}.ts
   */
  params: {
    parse: ({ _splat }) => ({ uri: parseObjectCardSplat(_splat ?? '') }),
    stringify: ({ uri }) => ({ _splat: uri ? createObjectCardSplat(uri) : '' }),
  },
});
