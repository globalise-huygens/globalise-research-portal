import * as React from 'react';
import {
  Checkbox,
  cn,
  Popover,
  ToolButton,
  Tooltip,
} from '@globalise/design';
import './EntityHighlightMenu.css';

export type EntityHighlightCategory = {
  id: string;
  label: string;
  tone?: string;
};

export type EntityHighlightMenuProps = {
  categories: EntityHighlightCategory[];
  selectedKeys: Set<string>;
  onSelectedKeysChange: React.Dispatch<React.SetStateAction<Set<string>>>;
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  title?: React.ReactNode;
  allLabel?: React.ReactNode;
  allDescription?: React.ReactNode;
  className?: string;
};

function EntityHighlightMenu({
  categories,
  selectedKeys,
  onSelectedKeysChange,
  triggerIcon,
  triggerClassName,
  triggerLabel = 'Entity highlights',
  title = 'Entity highlights',
  allLabel = 'All entity highlights',
  allDescription = 'Select or clear every classified entity highlight',
  className,
}: EntityHighlightMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const categoryIds = React.useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );
  const hasAnySelection = selectedKeys.size > 0;
  const areAllHighlightsSelected =
    categoryIds.length > 0 && selectedKeys.size === categoryIds.length;
  const areHighlightsPartiallySelected =
    hasAnySelection && !areAllHighlightsSelected;

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const setAllHighlights = React.useCallback(
    (isSelected: boolean) => {
      onSelectedKeysChange(isSelected ? new Set(categoryIds) : new Set());
    },
    [categoryIds, onSelectedKeysChange],
  );

  const toggleCategory = React.useCallback(
    (categoryId: string, isSelected: boolean) => {
      onSelectedKeysChange((current) => {
        const next = new Set(current);

        if (isSelected) {
          next.add(categoryId);
        } else {
          next.delete(categoryId);
        }

        return next;
      });
    },
    [onSelectedKeysChange],
  );

  return (
    <div ref={rootRef} className={cn('entity-menu', className)}>
      <Tooltip label={triggerLabel}>
        <ToolButton
          aria-expanded={isOpen}
          aria-label={
            hasAnySelection ? `Open ${triggerLabel}` : `Enable ${triggerLabel}`
          }
          isActive={hasAnySelection}
          className={triggerClassName}
          icon={triggerIcon}
          onPress={() => {
            if (!hasAnySelection) {
              setAllHighlights(true);
              setIsOpen(true);
              return;
            }

            setIsOpen((current) => !current);
          }}
        />
      </Tooltip>

      {isOpen && (
        <Popover
          role="dialog"
          aria-label={typeof title === 'string' ? title : triggerLabel}
          size="compact"
        >
          <h3>{title}</h3>

          <div className="content">
            <div className="all">
              <div className="all-copy">
                <div className="all-title">{allLabel}</div>
                {allDescription && (
                  <div className="all-description">
                    {allDescription}
                  </div>
                )}
              </div>
              <Checkbox
                aria-label="Toggle all entity highlights"
                isSelected={areAllHighlightsSelected}
                isIndeterminate={areHighlightsPartiallySelected}
                onChange={(nextSelected) => setAllHighlights(nextSelected)}
              />
            </div>

            <div className="list">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="row"
                  data-tone={category.tone}
                >
                  <div className="label">
                    <span className="label-text">
                      {category.label}
                    </span>
                  </div>
                  <Checkbox
                    aria-label={`Toggle ${category.label} entity highlights`}
                    isSelected={selectedKeys.has(category.id)}
                    onChange={(nextSelected) =>
                      toggleCategory(category.id, nextSelected)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}

export { EntityHighlightMenu };
