import { IconCopy, ObjectCardAction } from '@globalise/design';

type CardCopyActionProps = {
  uri: string;
  label?: string;
};

export function CardCopyAction({ uri, label = 'Copy URI' }: CardCopyActionProps) {
  function handleCopy() {
    navigator.clipboard.writeText(uri).catch(console.error);
  }

  return (
    <ObjectCardAction
      aria-label={label}
      icon={<IconCopy className="header-action-icon"/>}
      onPress={handleCopy}
    />
  );
}