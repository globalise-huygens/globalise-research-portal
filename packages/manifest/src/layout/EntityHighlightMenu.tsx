import * as React from 'react';
import type { AnnotationPresentationFamily } from '@globalise/common/annotation';
import {
  Checkbox,
  cn,
  IconExpandSection,
  isInsidePopoverCard,
  Popover,
  ToolButton,
  Tooltip,
} from '@globalise/design';
import { Button as AriaButton, VisuallyHidden } from 'react-aria-components';
import {
  EntityCategoryPreview, type EntityCategoryPreviewData,
} from './EntityCategoryPreview';
import './EntityHighlightMenu.css';

export type EntityHighlightSubcategory = {
  id?: string;
  label: string;
  family?: AnnotationPresentationFamily;
  preview?: EntityCategoryPreviewData;
};

export type EntityHighlightCategory = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  family?: AnnotationPresentationFamily;
  preview?: EntityCategoryPreviewData;
  subcategories?: EntityHighlightSubcategory[];
};

export type EntityHighlightMenuProps = {
  categories: EntityHighlightCategory[];
  selectedKeys: Set<string>;
  onSelectedKeysChange: React.Dispatch<React.SetStateAction<Set<string>>>;
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  allLabel?: React.ReactNode;
  className?: string;
};

function getLeafKeys(category: EntityHighlightCategory) {
  if (!category.subcategories || category.subcategories.length === 0) {
    return [category.id];
  }

  return category.subcategories.map(
    (subcategory) => subcategory.id ?? `${category.id}::${subcategory.label}`,
  );
}

function EntityHighlightMenu({
  categories,
  selectedKeys,
  onSelectedKeysChange,
  triggerIcon,
  triggerClassName,
  triggerLabel = 'Entity highlights',
  allLabel = 'All entity highlights',
  className,
}: EntityHighlightMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const previewHintId = React.useId();
  const allLeafKeys = React.useMemo(
    () => categories.flatMap((category) => getLeafKeys(category)),
    [categories],
  );
  const hasAnySelection = selectedKeys.size > 0;
  const areAllHighlightsSelected =
    allLeafKeys.length > 0 && selectedKeys.size === allLeafKeys.length;
  const areHighlightsPartiallySelected =
    hasAnySelection && !areAllHighlightsSelected;

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const { target } = event;
      const menu = rootRef.current;
      if (!(target instanceof Node) || !menu || menu.contains(target)) {
        return;
      }

      if (!isInsidePopoverCard(target)) {
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
      onSelectedKeysChange(isSelected ? new Set(allLeafKeys) : new Set());
    },
    [allLeafKeys, onSelectedKeysChange],
  );

  const toggleLeafKey = React.useCallback(
    (leafKey: string, isSelected: boolean) => {
      onSelectedKeysChange((current) => {
        const next = new Set(current);

        if (isSelected) {
          next.add(leafKey);
        } else {
          next.delete(leafKey);
        }

        return next;
      });
    },
    [onSelectedKeysChange],
  );

  const toggleCategory = React.useCallback(
    (category: EntityHighlightCategory, isSelected: boolean) => {
      const categoryLeafKeys = getLeafKeys(category);

      onSelectedKeysChange((current) => {
        const next = new Set(current);

        categoryLeafKeys.forEach((key) => {
          if (isSelected) {
            next.add(key);
          } else {
            next.delete(key);
          }
        });

        return next;
      });
    },
    [onSelectedKeysChange],
  );

  const toggleExpandedGroup = React.useCallback((groupName: string) => {
    setExpandedGroup((current) => (current === groupName ? null : groupName));
  }, []);

  return (
    <div ref={rootRef} className={cn('entity-menu', className)}>
      <VisuallyHidden id={previewHintId}>
        A preview opens on focus. Press Tab to explore it.
      </VisuallyHidden>
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
          aria-label={triggerLabel}
          size="compact"
          className="surface"
        >
          <div className="content">
            <div className="all">
              <div className="all-title">{allLabel}</div>
              <Checkbox
                aria-label="Toggle all entity highlights"
                isSelected={areAllHighlightsSelected}
                isIndeterminate={areHighlightsPartiallySelected}
                onChange={(nextSelected) => setAllHighlights(nextSelected)}
              />
            </div>

            <div className="list">
              {categories.map((category) => {
                const leafKeys = getLeafKeys(category);
                const selectedCount = leafKeys.filter((key) =>
                  selectedKeys.has(key),
                ).length;
                const isSelected =
                  leafKeys.length > 0 && selectedCount === leafKeys.length;
                const isIndeterminate =
                  selectedCount > 0 && selectedCount < leafKeys.length;
                const isExpanded = expandedGroup === category.id;
                const hasSubcategories =
                  category.subcategories && category.subcategories.length > 0;
                const label = (
                  <>
                    {category.icon && (
                      <span className="icon">
                        {category.icon}
                      </span>
                    )}
                    <span className="label-text">
                      {category.label}
                    </span>
                  </>
                );

                function renderLabel(attributes: React.AriaAttributes = {}) {
                  if (hasSubcategories) {
                    return (
                      <AriaButton
                        aria-label={`Toggle ${category.label} subcategories`}
                        aria-describedby={category.preview ? previewHintId : undefined}
                        aria-expanded={isExpanded}
                        className="label expand"
                        onPress={() => toggleExpandedGroup(category.id)}
                      >
                        {label}
                        <IconExpandSection
                          aria-hidden="true"
                          className="expand-icon"
                        />
                      </AriaButton>
                    );
                  }
                  if (!category.preview) {
                    return <div className="label">{label}</div>;
                  }

                  return (
                    <AriaButton
                      {...attributes}
                      aria-label={`Preview ${category.label}`}
                      className="label preview-label"
                    >
                      {label}
                    </AriaButton>
                  );
                }

                let categoryLabel: React.ReactNode;
                if (category.preview) {
                  categoryLabel = (
                    <EntityCategoryPreview
                      data={category.preview}
                      label={category.label}
                      opening={hasSubcategories ? 'action' : 'label'}
                    >
                      {renderLabel}
                    </EntityCategoryPreview>
                  );
                } else if (hasSubcategories) {
                  const action = isExpanded ? 'Hide' : 'Show';
                  const tooltip = `${action} ${category.label} subcategories`;
                  categoryLabel = (
                    <Tooltip label={tooltip}>{renderLabel()}</Tooltip>
                  );
                } else {
                  categoryLabel = renderLabel();
                }

                return (
                  <div key={category.id} className="category">
                    <div
                      className={cn(
                        'row',
                        category.family && `annotation-${category.family}`,
                      )}
                      data-level="category"
                    >
                      {categoryLabel}
                      <Checkbox
                        aria-label={`Toggle ${category.label} entity highlights`}
                        isSelected={isSelected}
                        isIndeterminate={isIndeterminate}
                        onChange={(nextSelected) =>
                          toggleCategory(category, nextSelected)
                        }
                      />
                    </div>

                    {isExpanded && hasSubcategories && (
                      <div className="subcategories">
                        {category.subcategories?.map((subcategory) => {
                          const leafKey =
                            subcategory.id ??
                            `${category.id}::${subcategory.label}`;

                          return (
                            <div
                              key={leafKey}
                              className={cn(
                                'row',
                                (subcategory.family ?? category.family)
                                  ? `annotation-${subcategory.family ?? category.family}`
                                  : undefined,
                              )}
                              data-level="subcategory"
                            >
                              {subcategory.preview ? (
                                <EntityCategoryPreview
                                  data={subcategory.preview}
                                  label={`${category.label} ${subcategory.label}`}
                                >
                                  {(attributes) => (
                                    <AriaButton
                                      {...attributes}
                                      aria-label={`Preview ${category.label} ${subcategory.label}`}
                                      className="label preview-label"
                                    >
                                      <span className="label-text">{subcategory.label}</span>
                                    </AriaButton>
                                  )}
                                </EntityCategoryPreview>
                              ) : (
                                <div className="label">
                                  <span className="label-text">{subcategory.label}</span>
                                </div>
                              )}
                              <Checkbox
                                aria-label={`Toggle ${subcategory.label} entity highlights`}
                                isSelected={selectedKeys.has(leafKey)}
                                onChange={(nextSelected) =>
                                  toggleLeafKey(leafKey, nextSelected)
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}

export { EntityHighlightMenu };
