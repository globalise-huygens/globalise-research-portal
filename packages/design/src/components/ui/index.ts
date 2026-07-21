export { Button, ButtonLink, buttonVariants } from './Button';
export type { ButtonLinkProps, ButtonProps } from './Button';

export { CardArticle } from './CardArticle';
export type { CardArticleProps } from './CardArticle';

export {
  CardBase,
  CardBaseContent,
  CardBaseDescription,
  CardBaseFooter,
  CardBaseHeader,
  CardBaseTitle,
  cardBaseVariants,
} from './CardBase';
export type { CardBaseProps } from './CardBase';

export {
  Navbar,
  NavLink,
  NavLinks,
  NavSearchBar,
} from './Navbar';
export type {
  NavbarProps,
  NavLinkProps,
  NavLinksProps,
  NavSearchBarProps,
} from './Navbar';

export { Container, containerVariants } from './Container';
export type { ContainerProps } from './Container';

export { Divider, dividerVariants } from './Divider';
export type { DividerProps } from './Divider';

export { CardFeatured } from './CardFeatured';
export type {
  CardFeaturedItem,
  CardFeaturedProps,
} from './CardFeatured';

export { CardGlance, cardGlanceVariants } from './CardGlance';
export type { CardGlanceProps } from './CardGlance';

export { CardHero, cardHeroVariants } from './CardHero';
export type { CardHeroProps } from './CardHero';

export { Typography, typographyVariants } from './Typography';
export type { TypographyProps } from './Typography';

export { Section, sectionVariants } from './Section';
export type { SectionProps } from './Section';

export { Grid } from './Grid';
export type { GridProps } from './Grid';

export { GridGuide } from './GridGuide';
export type { GridGuideProps } from './GridGuide';

export { SectionDivider } from './SectionDivider';
export type { SectionDividerProps } from './SectionDivider';

export { NewsletterSignup } from './NewsletterSignup';
export type { NewsletterSignupProps } from './NewsletterSignup';

export { EntityBadge, entityBadgeVariants } from './EntityBadge';
export type {
  EntityBadgeProps,
  EntityBadgeType,
} from './EntityBadge';

export { EntityPreviewCard } from './EntityPreviewCard';
export type {
  EntityPreviewCardAutomationBadge,
  EntityPreviewCardBaseData,
  EntityPreviewCardCommodityData,
  EntityPreviewCardData,
  EntityPreviewCardDateData,
  EntityPreviewCardDimensionsData,
  EntityPreviewCardDocumentData,
  EntityPreviewCardKind,
  EntityPreviewCardOrganisationData,
  EntityPreviewCardPersonData,
  EntityPreviewCardPlaceData,
  EntityPreviewCardPolityData,
  EntityPreviewCardProps,
  EntityPreviewCardQuantityData,
  EntityPreviewCardShipData,
} from './EntityPreviewCard';

export { EntityTag, entityTagVariants } from './EntityTag';
export type { EntityTagProps, EntityTagType } from './EntityTag';

export { ObjectCardOverlay } from './ObjectCardOverlay';
export type { ObjectCardOverlayProps } from './ObjectCardOverlay';

export {
  ObjectCard,
  ObjectCardAction,
  objectCardActionVariants,
  ObjectCardBody,
  ObjectCardExternalLink,
  ObjectCardFooter,
  ObjectCardHeader,
  ObjectCardListItem,
  ObjectCardPanel,
  objectCardPanelVariants,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
  ObjectCardStat,
  ObjectCardStats,
  ObjectCardTitle,
} from './ObjectCard';
export type {
  ObjectCardActionProps,
  ObjectCardBodyProps,
  ObjectCardExternalLinkProps,
  ObjectCardFooterProps,
  ObjectCardHeaderProps,
  ObjectCardListItemProps,
  ObjectCardPanelProps,
  ObjectCardPropertyListProps,
  ObjectCardPropertyProps,
  ObjectCardProps,
  ObjectCardSectionProps,
  ObjectCardStatProps,
  ObjectCardStatsProps,
  ObjectCardTitleProps,
} from './ObjectCard';

export {
  ReferencePanel,
  ReferencePanelHeader,
  ReferencePanelItem,
  ReferencePanelList,
} from './ReferencePanel';
export type {
  ReferencePanelHeaderProps,
  ReferencePanelItemData,
  ReferencePanelItemProps,
  ReferencePanelListProps,
  ReferencePanelProps,
} from './ReferencePanel';

/**
 * @deprecated Import viewer primitives from `@globalise/design/viewer`.
 * These names remain available here for compatibility.
 */
export {
  ContentWarningControl,
  ViewerBarGroup,
  ViewerBody,
  ViewerBottomBar,
  ViewerCanvas,
  ViewerCheckbox,
  ViewerControl,
  EntityHighlightMenu,
  ViewerFloatingToolbar,
  ViewerIconRail,
  ViewerMetadataSidebar,
  ViewerMetadataSidebarBadge,
  ViewerMetadataSidebarButton,
  ViewerNumberField,
  ViewerPanelHeader,
  ViewerPopover,
  ViewerRailButton,
  ViewerReferenceCard,
  ViewerSegment,
  ViewerSegmentedControl,
  ViewerToggleGroup,
  ViewerToggle,
  ViewerSidebarSection,
  ViewerSidePanel,
  SplitViewer,
  ViewerTitle,
  ViewerDockedToolbar,
  ViewerToolButton,
  ViewerTooltip,
  ViewerTopBar,
  TranscriptionCanvas,
  TranscriptionLine,
  ViewerArea,
  ViewerPane,
} from './viewer/compat';
/**
 * @deprecated Legacy viewer retained until its remaining behavior has been
 * transferred. Compose the active viewer with `@globalise/design/viewer`.
 */
export { ManifestViewer } from './viewer/legacy/Root';
/** @deprecated See `ManifestViewer`. */
export type { ManifestViewerProps } from './viewer/legacy/Root';
/**
 * @deprecated Import viewer primitive types from `@globalise/design/viewer`.
 * These names remain available here for compatibility.
 */
export type {
  ViewerBarGroupProps,
  ViewerBodyProps,
  ViewerBottomBarProps,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  ViewerCanvasProps,
  ViewerCheckboxProps,
  ViewerControlProps,
  EntityHighlightCategory,
  EntityHighlightMenuProps,
  EntityHighlightSubcategory,
  ViewerFloatingToolbarProps,
  ViewerIconRailProps,
  ViewerMetadataSidebarBadgeProps,
  ViewerMetadataSidebarButtonProps,
  ViewerMetadataSidebarProps,
  ViewerNumberFieldProps,
  ViewerPanelHeaderProps,
  ViewerPopoverProps,
  ViewerRailButtonProps,
  ViewerReferenceCardProps,
  ViewerSegmentedControlProps,
  ViewerToggleGroupProps,
  ViewerToggleProps,
  ViewerSegmentProps,
  ViewerSidebarSectionProps,
  ViewerSidePanelProps,
  SplitViewerProps,
  ViewerTitleProps,
  ViewerDockedToolbarProps,
  ViewerToolButtonProps,
  ViewerTooltipProps,
  ViewerTopBarProps,
  TranscriptionCanvasProps,
  TranscriptionLineProps,
  ViewerPaneProps,
  ViewerAreaProps,
} from './viewer/compat';
/** @deprecated See `ManifestViewer`. */
export { ManifestViewerOverlay } from './viewer/legacy/Overlay';
/** @deprecated See `ManifestViewer`. */
export type { ManifestViewerOverlayProps } from './viewer/legacy/Overlay';
/** @deprecated Legacy viewer data types retained for compatibility. */
export type {
  ManifestViewerContent,
  ManifestViewerDocument,
  ManifestViewerIdentifiedEntity,
  ManifestViewerInventoryHierarchyItem,
  ManifestViewerInventoryMetadataItem,
  ManifestViewerPaneKey,
  ManifestViewerScan,
  ManifestViewerScanRenderArgs,
  ManifestViewerScanRenderer,
  ManifestViewerSidebarSectionId,
  ManifestViewerTagGroup,
  ManifestViewerTagSubcategory,
  ManifestViewerTocMetadata,
} from './viewer/legacy/Types';

export { SearchBar, searchBarVariants } from './SearchBar';
export type { SearchBarProps } from './SearchBar';

export { ArticleRow } from './ArticleRow';
export type { ArticleRowProps } from './ArticleRow';
