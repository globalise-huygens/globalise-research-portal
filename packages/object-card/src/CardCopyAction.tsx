import { IconCopy, ObjectCardAction, useCopy } from '@globalise/design';

type CardCopyActionProps = {
  uri: string;
  label?: string;
};

export function CardCopyAction({ uri, label = 'Copy URI' }: CardCopyActionProps) {
  const { copy } = useCopy();

  function handleCopy() {
    void copy(uri);
  }

  return (
    <ObjectCardAction
      aria-label={label}
      icon={<IconCopy className="header-action-icon"/>}
      onPress={handleCopy}
    />
  );
}
