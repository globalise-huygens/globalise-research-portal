/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';

type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(' ');
}

type HtmlProps<T extends keyof React.JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T>;

export function DocumentDetailTopBar({ className, ...props }: HtmlProps<'header'>) {
  return <header className={cn('flex shrink-0', className)} {...props} />;
}

export function DocumentDetailBottomBar({ className, ...props }: HtmlProps<'footer'>) {
  return <footer className={cn('flex shrink-0 items-center', className)} {...props} />;
}

export function DocumentDetailBarGroup({ className, ...props }: HtmlProps<'div'>) {
  return <div className={cn('flex items-center', className)} {...props} />;
}

export function DocumentDetailBody({ className, ...props }: HtmlProps<'main'>) {
  return <main className={cn('min-h-0 flex-1 overflow-hidden', className)} {...props} />;
}

export function DocumentDetailSplitViewer({ className, ...props }: HtmlProps<'div'>) {
  return <div className={cn('grid h-full min-h-0 grid-cols-1', className)} {...props} />;
}

export function DocumentDetailViewerPane({ className, ...props }: HtmlProps<'section'>) {
  return <section className={cn('min-h-0 overflow-hidden', className)} {...props} />;
}

export function DocumentDetailCanvas({ className, ...props }: HtmlProps<'div'>) {
  return <div className={cn('relative h-full w-full overflow-hidden', className)} {...props} />;
}

export function DocumentDetailTranscriptCanvas({ className, ...props }: HtmlProps<'div'>) {
  return <div className={cn('relative h-full w-full overflow-hidden', className)} {...props} />;
}

export function DocumentDetailMetadataSidebar({ className, ...props }: HtmlProps<'aside'>) {
  return <aside className={cn('flex h-full flex-col', className)} {...props} />;
}

export function DocumentDetailMetadataSidebarBadge({ className, ...props }: HtmlProps<'span'>) {
  return (
    <span
      className={cn('ml-auto rounded-sm bg-brand-white/12 px-s6 py-s2 text-xs', className)}
      {...props}
    />
  );
}

type MetadataSidebarButtonProps = Omit<HtmlProps<'button'>, 'children'> & {
  icon?: React.ReactNode;
  label: React.ReactNode;
  count?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
};

export function DocumentDetailMetadataSidebarButton({
  className,
  icon,
  label,
  count,
  trailing,
  children,
  onPress,
  ...props
}: MetadataSidebarButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-s12 border-b border-brand-white/10 px-s16 text-left text-brand-white',
        className,
      )}
      onClick={onPress}
      {...props}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
      {count && <span className="text-xs text-brand-white/60">{count}</span>}
      {children}
      {trailing}
    </button>
  );
}

export function DocumentDetailIconRail({ className, ...props }: HtmlProps<'nav'>) {
  return <nav className={cn('flex flex-col items-center', className)} {...props} />;
}

type RailButtonProps = Omit<HtmlProps<'button'>, 'children'> & {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onPress?: () => void;
};

export function DocumentDetailRailButton({
  className,
  icon,
  label,
  onPress,
  ...props
}: RailButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-s64 w-full flex-col items-center justify-center gap-s4 border-b border-brand-white/10 text-xs text-brand-white',
        className,
      )}
      onClick={onPress}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

type ToolButtonProps = Omit<HtmlProps<'button'>, 'children'> & {
  icon?: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
};

export function DocumentDetailToolButton({
  className,
  icon,
  isActive,
  isDisabled,
  onPress,
  ...props
}: ToolButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center text-brand-white',
        isActive && 'bg-brand-white/12',
        className,
      )}
      disabled={isDisabled}
      onClick={onPress}
      {...props}
    >
      {icon}
    </button>
  );
}

export function DocumentDetailTooltip({ children }: {
  children: React.ReactElement;
  label: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return children;
}

type SegmentedToggleContextValue = {
  selectedKeys: Set<string>;
  toggle: (id: string) => void;
};

const SegmentedToggleContext = React.createContext<SegmentedToggleContextValue | null>(null);

type SegmentedToggleGroupProps = Omit<HtmlProps<'div'>, 'onChange'> & {
  selectedKeys: string[] | Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  selectionMode?: 'single' | 'multiple';
};

export function DocumentDetailSegmentedToggleGroup({
  className,
  selectedKeys,
  onSelectionChange,
  selectionMode: _selectionMode,
  children,
  ...props
}: SegmentedToggleGroupProps) {
  const value = React.useMemo(() => {
    const selected = new Set(Array.from(selectedKeys).map(String));
    return {
      selectedKeys: selected,
      toggle: (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        onSelectionChange(next);
      },
    };
  }, [onSelectionChange, selectedKeys]);

  return (
    <SegmentedToggleContext.Provider value={value}>
      <div
        className={cn('inline-flex overflow-hidden rounded-sm border border-brand-white/12', className)}
        {...props}
      >
        {children}
      </div>
    </SegmentedToggleContext.Provider>
  );
}

type SegmentedToggleItemProps = Omit<HtmlProps<'button'>, 'id'> & {
  id: string;
  icon?: React.ReactNode;
};

export function DocumentDetailSegmentedToggleItem({
  className,
  id,
  icon,
  children,
  ...props
}: SegmentedToggleItemProps) {
  const context = React.useContext(SegmentedToggleContext);
  const isSelected = context?.selectedKeys.has(id) ?? false;
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-s36 items-center gap-s6 px-s10 text-sm text-brand-white/75',
        isSelected && 'bg-brand-white/12 text-brand-white',
        className,
      )}
      onClick={() => context?.toggle(id)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

function createIcon(path: React.ReactNode) {
  return function Icon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        {path}
      </svg>
    );
  };
}

export const IconSidebar = createIcon(
  <>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M9 5v14" />
  </>,
);

export const IconScan = createIcon(
  <>
    <rect x="5" y="4" width="14" height="16" rx="1.5" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </>,
);

export const IconTranscription = createIcon(
  <>
    <path d="M6 5h12M6 9h12M6 13h8M6 17h10" />
  </>,
);

export const IconInventory = createIcon(
  <>
    <path d="M5 6h14v13H5z" />
    <path d="M8 6V4h8v2M8 10h8M8 14h8" />
  </>,
);

export const IconTableOfContent = createIcon(
  <>
    <path d="M7 6h12M7 12h12M7 18h12" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </>,
);

export const IconEntities = createIcon(
  <>
    <circle cx="9" cy="8" r="3" />
    <circle cx="16" cy="16" r="3" />
    <path d="M11.5 10.5l2 3" />
  </>,
);

export const IconEvents = createIcon(
  <>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <path d="M8 3v4M16 3v4M5 10h14" />
  </>,
);

export const IconExpandSection = createIcon(<path d="M8 10l4 4 4-4" />);
export const IconLeft = createIcon(<path d="M15 6l-6 6 6 6" />);
export const IconRight = createIcon(<path d="M9 6l6 6-6 6" />);
export const IconLeftFirst = createIcon(<><path d="M18 6l-6 6 6 6" /><path d="M7 5v14" /></>);
export const IconRightLast = createIcon(<><path d="M6 6l6 6-6 6" /><path d="M17 5v14" /></>);
