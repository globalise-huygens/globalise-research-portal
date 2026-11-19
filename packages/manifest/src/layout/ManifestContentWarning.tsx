import {
  IconArrowTopRight,
  IconContentWarning,
  ToolButton,
} from '@globalise/design';
import { useId, useState } from 'react';

const contentWarning = {
  title: 'Content Warning',
  body:
    'The Dutch East India Company archives (and consequently their transcriptions) and its document descriptions bear harmful and discriminatory language. They also record a wide range of events, intentions and perspectives that are violent and can cause distress.',
  linkLabel: 'Read more about problematic content',
};

export function ManifestContentWarning({ iconOnly = false }: { iconOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = useId();

  return (
    <div className="content-warning">
      <ToolButton
        aria-label={isOpen ? 'Hide content warning' : 'Show content warning'}
        aria-expanded={isOpen}
        aria-controls={isOpen ? detailsId : undefined}
        icon={<IconContentWarning />}
        isActive={isOpen}
        onPress={() => setIsOpen((open) => !open)}
        size="compact"
      >
        {!iconOnly && contentWarning.title}
      </ToolButton>
      {isOpen && (
        <div
          id={detailsId}
          className="details"
          role="region"
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
