import * as React from 'react';

const SCROLL_LOCK_COUNT_KEY = 'uiScrollLockCount';
const ORIGINAL_OVERFLOW_KEY = 'uiOriginalOverflow';
const ORIGINAL_PADDING_RIGHT_KEY = 'uiOriginalPaddingRight';

/**
 * Locks body scrolling while `locked` is true.
 * Uses a ref-count to avoid unlocking too early when multiple overlays are open.
 */
export function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked || typeof document === 'undefined') {
      return;
    }

    const { body, documentElement } = document;
    const count = Number(body.dataset[SCROLL_LOCK_COUNT_KEY] ?? '0');

    if (count === 0) {
      body.dataset[ORIGINAL_OVERFLOW_KEY] = body.style.overflow;
      body.dataset[ORIGINAL_PADDING_RIGHT_KEY] = body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      const currentPaddingRight = Number.parseFloat(
        window.getComputedStyle(body).paddingRight,
      );
      const safePaddingRight = Number.isNaN(currentPaddingRight)
        ? 0
        : currentPaddingRight;

      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${safePaddingRight + scrollbarWidth}px`;
      }
    }

    body.dataset[SCROLL_LOCK_COUNT_KEY] = String(count + 1);

    return () => {
      const currentCount = Number(body.dataset[SCROLL_LOCK_COUNT_KEY] ?? '1');
      const nextCount = currentCount - 1;

      if (nextCount <= 0) {
        body.style.overflow = body.dataset[ORIGINAL_OVERFLOW_KEY] ?? '';
        body.style.paddingRight =
          body.dataset[ORIGINAL_PADDING_RIGHT_KEY] ?? '';
        delete body.dataset[SCROLL_LOCK_COUNT_KEY];
        delete body.dataset[ORIGINAL_OVERFLOW_KEY];
        delete body.dataset[ORIGINAL_PADDING_RIGHT_KEY];
        return;
      }

      body.dataset[SCROLL_LOCK_COUNT_KEY] = String(nextCount);
    };
  }, [locked]);
}
