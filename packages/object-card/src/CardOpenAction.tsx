import { IconExternalLink, ObjectCardAction } from '@globalise/design';

type CardOpenActionProps = {
  url: string;
  label?: string;
};

export function CardOpenAction({ url, label = 'Open JSON-LD' }: CardOpenActionProps) {
  function handleOpen() {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <ObjectCardAction
      aria-label={label}
      icon={<IconExternalLink className="header-action-icon"/>}
      onPress={handleOpen}
    />
  );
}