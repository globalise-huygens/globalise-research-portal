import {
  IconArrowTopRight,
  IconContentWarning,
  ToolButton,
} from '@globalise/design';
import { useState } from 'react';

const contentWarning = {
  title: 'Content Warning',
  body:
    'The Dutch East India Company archives (and consequently their transcriptions) and its document descriptions bear harmful and discriminatory language. They also record a wide range of events, intentions and perspectives that are violent and can cause distress.',
  linkLabel: 'Read more about problematic content',
};

export function ManifestContentWarning() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHoverPreviewOpen, setIsHoverPreviewOpen] = useState(false);
  const isDetailsOpen = isOpen || isHoverPreviewOpen;

  return (
    <div className="content-warning">
      <ToolButton
        aria-label={isOpen ? 'Hide content warning' : 'Show content warning'}
        icon={<IconContentWarning />}
        isActive={isOpen}
        onBlur={() => setIsHoverPreviewOpen(false)}
        onFocus={() => setIsHoverPreviewOpen(true)}
        onMouseEnter={() => setIsHoverPreviewOpen(true)}
        onMouseLeave={() => setIsHoverPreviewOpen(false)}
        onPress={() => setIsOpen((open) => !open)}
        size="compact"
      >
        {contentWarning.title}
      </ToolButton>
      {isDetailsOpen && (
        <div
          className="details"
          role="dialog"
          aria-label={contentWarning.title}
        >
          <p>{contentWarning.body}</p>
          <a href="#">
            <span>{contentWarning.linkLabel}</span>
            <IconArrowTopRight aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}
