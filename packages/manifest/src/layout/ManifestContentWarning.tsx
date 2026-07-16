import { ContentWarningControl } from '@globalise/design/viewer';
import { useState } from 'react';

const contentWarning = {
  title: 'Content Warning',
  body:
    'The Dutch East India Company archives (and consequently their transcriptions) and its document descriptions bear harmful and discriminatory language. They also record a wide range of events, intentions and perspectives that are violent and can cause distress.',
  linkLabel: 'Read more about problematic content',
};

export function ManifestContentWarning() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="manifest-document-layout__content-warning">
      <ContentWarningControl
        warning={contentWarning}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}
