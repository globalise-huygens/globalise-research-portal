import { createFileRoute, notFound } from '@tanstack/react-router';
import { createObjectCardSplat, parseObjectCardSplat } from '@globalise/common/uri';

export const Route = createFileRoute('/hdl:20.500.14722/$')({

  /**
   * See also: ./inventory:{$}.ts
   */
  params: {
    parse: ({ _splat }) => {
      const uri = parseObjectCardSplat(_splat ?? '');
      if (!uri) {
        throw notFound();
      }
      return { uri };
    },
    stringify: ({ uri }) => ({ _splat: createObjectCardSplat(uri) ?? '' }),
  },
});
