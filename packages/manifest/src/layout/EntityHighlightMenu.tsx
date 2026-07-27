import * as React from 'react';
import {
  Checkbox,
  cn,
  IconExpandSection,
  Popover,
  ToolButton,
  Tooltip,
} from '@globalise/design';
import './EntityHighlightMenu.css';

export type EntityHighlightSubcategory = {
  id?: string;
  label: string;
  count?: number;
};

export type EntityHighlightCategory = {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  tone?: string;
  subcategories?: EntityHighlightSubcategory[];
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
  title = 'Entity highlights',
  allLabel = 'All entity highlights',
  allDescription = 'Select or clear every classified entity highlight',
  className,
}: EntityHighlightMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => new Set(),
  );
  const rootRef = React.useRef<HTMLDivElement>(null);
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
    setExpandedGroups((current) => {
      const next = new Set(current);

      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }

      return next;
    });
  }, []);

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
          className="surface"
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
              {categories.map((category) => {
                const leafKeys = getLeafKeys(category);
                const selectedCount = leafKeys.filter((key) =>
                  selectedKeys.has(key),
                ).length;
                const isSelected =
                  leafKeys.length > 0 && selectedCount === leafKeys.length;
                const isIndeterminate =
                  selectedCount > 0 && selectedCount < leafKeys.length;
                const isExpanded = expandedGroups.has(category.id);
                const hasSubcategories =
                  category.subcategories && category.subcategories.length > 0;

                return (
                  <div key={category.id} className="category">
                    <div
                      className="row"
                      data-level="category"
                      data-tone={category.tone}
                    >
                      <div className="label">
                        {category.icon && (
                          <span className="icon">
                            {category.icon}
                          </span>
                        )}
                        <span className="label-text">
                          {category.label}
                        </span>
                      </div>
                      {category.count !== undefined && (
                        <span className="count">{category.count}</span>
                      )}
                      <div className="actions">
                        {hasSubcategories && (
                          <button
                            type="button"
                            aria-label={`Toggle ${category.label} subcategories`}
                            aria-expanded={isExpanded}
                            className="expand"
                            onClick={() => toggleExpandedGroup(category.id)}
                          >
                            <IconExpandSection
                              aria-hidden="true"
                              className="expand-icon"
                            />
                          </button>
                        )}
                        <Checkbox
                          aria-label={`Toggle ${category.label} entity highlights`}
                          isDisabled={(category.count ?? 1) <= 0}
                          isSelected={isSelected}
                          isIndeterminate={isIndeterminate}
                          onChange={(nextSelected) =>
                            toggleCategory(category, nextSelected)
                          }
                        />
                      </div>
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
                              className="row"
                              data-level="subcategory"
                              data-tone={category.tone}
                            >
                              <div className="label">
                                {category.icon && (
                                  <span className="icon">
                                    {category.icon}
                                  </span>
                                )}
                                <span className="label-text">
                                  {subcategory.label}
                                </span>
                              </div>
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
