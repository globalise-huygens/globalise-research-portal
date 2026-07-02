import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Heading as AriaHeading,
  Link as AriaLink,
} from 'react-aria-components';
import { ObjectCardPanel, type ObjectCardPanelProps } from './ObjectCard';
import { IconArrowTopRight, IconCopy, IconExternalLink } from '../icons';

type ReferencePanelActionTooltipProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

function ReferencePanelActionTooltip({
  label,
  children,
}: ReferencePanelActionTooltipProps) {
  return (
    <span className="gds-reference-panel-item__action-with-tooltip">
      {children}
      <span
        aria-hidden="true"
        className="gds-reference-panel-item__action-tooltip gds-document-detail-tooltip"
      >
        {label}
      </span>
    </span>
  );
}

export type ReferencePanelItemProps = {
  isActive?: boolean;
  thumbnail?: React.ReactNode;
  title: React.ReactNode;
  snippet?: React.ReactNode;
  metadata?: React.ReactNode;
  href?: string;
  hrefLabel?: string;
  hrefType?: 'internal' | 'external';
  uri?: string;
  copyLabel?: string;
  onCopyUri?: (uri: string) => void;
  actions?: React.ReactNode;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
>;

function ReferencePanelItem({
  className,
  isActive = false,
  thumbnail,
  title,
  snippet,
  metadata,
  href,
  hrefLabel = 'Open reference',
  hrefType = 'internal',
  uri,
  copyLabel = 'Copy URI',
  onCopyUri,
  actions,
  ...props
}: ReferencePanelItemProps) {
  const handleCopyUri: AriaButtonProps['onPress'] = () => {
    if (!uri) {
      return;
    }

    if (onCopyUri) {
      onCopyUri(uri);
      return;
    }

    void navigator.clipboard?.writeText(uri);
  };

  return (
    <div
      aria-current={isActive ? 'true' : undefined}
      className={cn('gds-reference-panel-item', className)}
      {...props}
    >
      <div
        className="gds-reference-panel-item__layout"
        data-has-thumbnail={thumbnail ? 'true' : 'false'}
      >
        {thumbnail && (
          <div className="gds-reference-panel-item__thumbnail">{thumbnail}</div>
        )}

        <div className="gds-reference-panel-item__body">
          <div className="gds-reference-panel-item__header">
            <div className="gds-reference-panel-item__title">{title}</div>
            <div className="gds-reference-panel-item__actions">
              {actions}
              {uri && (
                <ReferencePanelActionTooltip label={copyLabel}>
                  <AriaButton
                    aria-label={copyLabel}
                    onPress={handleCopyUri}
                    className="gds-reference-panel-item__action"
                  >
                    <IconCopy className="gds-reference-panel-item__action-icon" />
                  </AriaButton>
                </ReferencePanelActionTooltip>
              )}
              {href && hrefType === 'external' && (
                <ReferencePanelActionTooltip label={hrefLabel}>
                  <AriaLink
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={hrefLabel}
                    className="gds-reference-panel-item__action"
                  >
                    <IconExternalLink className="gds-reference-panel-item__action-icon" />
                  </AriaLink>
                </ReferencePanelActionTooltip>
              )}
              {href && hrefType === 'internal' && (
                <ReferencePanelActionTooltip label={hrefLabel}>
                  <AriaLink
                    href={href}
                    aria-label={hrefLabel}
                    className="gds-reference-panel-item__action"
                  >
                    <IconArrowTopRight className="gds-reference-panel-item__action-icon" />
                  </AriaLink>
                </ReferencePanelActionTooltip>
              )}
            </div>
          </div>

          {snippet && (
            <div className="gds-reference-panel-item__snippet">
              <div className="gds-reference-panel-item__snippet-text">
                {snippet}
              </div>
            </div>
          )}

          {metadata && (
            <div className="gds-reference-panel-item__metadata">{metadata}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export type ReferencePanelHeaderProps = {
  title?: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  headingId?: string;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
>;

function ReferencePanelHeader({
  className,
  title,
  children,
  level = 3,
  headingId,
  ...props
}: ReferencePanelHeaderProps) {
  return (
    <div className={cn('gds-reference-panel-header', className)} {...props}>
      {title && (
        <AriaHeading
          id={headingId}
          level={level}
          className="gds-reference-panel-header__heading"
        >
          {title}
        </AriaHeading>
      )}
      {children}
    </div>
  );
}

export type ReferencePanelListProps = {} & React.HTMLAttributes<HTMLDivElement>;

const ReferencePanelList = React.forwardRef<
  HTMLDivElement,
  ReferencePanelListProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('gds-reference-panel-list', className)}
    {...props}
  />
));
ReferencePanelList.displayName = 'ReferencePanelList';

export type ReferencePanelItemData = {
  id?: string;
  isActive?: boolean;
  thumbnail?: React.ReactNode;
  title: React.ReactNode;
  snippet?: React.ReactNode;
  metadata?: React.ReactNode;
  href?: string;
  hrefLabel?: string;
  hrefType?: 'internal' | 'external';
  uri?: string;
  copyLabel?: string;
  actions?: React.ReactNode;
};

export type ReferencePanelProps = {
  title?: React.ReactNode;
  items?: ReferencePanelItemData[];
  children?: React.ReactNode;
  emptyState?: React.ReactNode;
  onCopyUri?: (uri: string) => void;
  progressiveLoading?: boolean;
  initialVisibleCount?: number;
  loadMoreStep?: number;
  loadMoreLabel?: string;
  autoLoadMore?: boolean;
} & Omit<
  ObjectCardPanelProps,
  'side' | 'children' | 'title'
>;

function ReferencePanel({
  className,
  title = 'References',
  items,
  children,
  emptyState,
  onCopyUri,
  progressiveLoading = false,
  initialVisibleCount = 24,
  loadMoreStep = 24,
  loadMoreLabel = 'Load more',
  autoLoadMore = false,
  ...props
}: ReferencePanelProps) {
  const headingId = React.useId();
  const liveRegionId = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = React.useRef<HTMLDivElement>(null);
  const hasItems = items && items.length > 0;
  const clampedInitialVisibleCount = Math.max(1, initialVisibleCount);
  const clampedLoadMoreStep = Math.max(1, loadMoreStep);
  const [visibleCount, setVisibleCount] = React.useState(
    clampedInitialVisibleCount,
  );
  const [liveMessage, setLiveMessage] = React.useState('');

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(clampedInitialVisibleCount);
    setLiveMessage('');
  }, [items, clampedInitialVisibleCount]);

  const visibleItems = React.useMemo(() => {
    if (!items) {
      return [];
    }

    if (!progressiveLoading) {
      return items;
    }

    return items.slice(0, visibleCount);
  }, [items, progressiveLoading, visibleCount]);

  const canLoadMore = Boolean(
    progressiveLoading &&
    items &&
    items.length > 0 &&
    visibleCount < items.length,
  );

  const handleLoadMore = React.useCallback(() => {
    if (!items || items.length === 0) {
      return;
    }

    const nextVisibleCount = Math.min(
      items.length,
      visibleCount + clampedLoadMoreStep,
    );

    if (nextVisibleCount === visibleCount) {
      return;
    }

    setVisibleCount(nextVisibleCount);
    setLiveMessage(`Loaded ${nextVisibleCount} of ${items.length} references.`);
  }, [items, visibleCount, clampedLoadMoreStep]);

  React.useEffect(() => {
    if (!autoLoadMore || !canLoadMore) {
      return;
    }

    const root = listRef.current;
    const target = loadMoreSentinelRef.current;

    if (!root || !target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          handleLoadMore();
        }
      },
      {
        root,
        rootMargin: '120px',
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [autoLoadMore, canLoadMore, handleLoadMore]);

  const handleLoadMorePress: AriaButtonProps['onPress'] = () => {
    handleLoadMore();
  };

  return (
    <ObjectCardPanel side="right" className={className} {...props}>
      <section aria-labelledby={headingId} className="gds-reference-panel">
        <ReferencePanelHeader title={title} headingId={headingId} />
        {children}
        {hasItems ? (
          <>
            <div
              id={liveRegionId}
              aria-live="polite"
              aria-atomic="true"
              className="gds-reference-panel__live-region"
            >
              {liveMessage}
            </div>

            <ReferencePanelList ref={listRef}>
              {visibleItems.map((item, index) => (
                <ReferencePanelItem
                  key={item.id ?? `reference-${index}`}
                  onCopyUri={onCopyUri}
                  {...item}
                />
              ))}

              {autoLoadMore && canLoadMore && (
                <div
                  ref={loadMoreSentinelRef}
                  aria-hidden="true"
                  className="gds-reference-panel__infinite-sentinel"
                />
              )}
            </ReferencePanelList>

            {!autoLoadMore && canLoadMore && items && (
              <ReferencePanelItem
                className="gds-reference-panel__load-more-item"
                title={
                  <AriaButton
                    onPress={handleLoadMorePress}
                    aria-controls={liveRegionId}
                    className="gds-reference-panel__load-more"
                  >
                    {loadMoreLabel}
                    <span className="gds-reference-panel__load-more-count">
                      ({visibleItems.length}/{items.length})
                    </span>
                  </AriaButton>
                }
              />
            )}
          </>
        ) : (
          !children && emptyState
        )}
      </section>
    </ObjectCardPanel>
  );
}

export {
  ReferencePanel,
  ReferencePanelHeader,
  ReferencePanelItem,
  ReferencePanelList,
};
