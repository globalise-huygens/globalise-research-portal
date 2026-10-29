'use client';

import './ManifestLayout.css';
import '../responsive/responsive.css';
import { useIsMobile } from '@globalise/design';
import type { ReactNode } from 'react';
import { DesktopLayout } from '../responsive/DesktopLayout';
import { MobileLayout } from '../responsive/MobileLayout';
import type { ErrorMessage } from './ManifestError';

export type ManifestLayoutProps = {
  topLeft?: ReactNode;
  topCenter?: ReactNode;
  topRight?: ReactNode;
  scan?: ReactNode;
  transcription?: ReactNode;
  bottom?: ReactNode;
  error?: ErrorMessage;
  onClose?: () => void;
};

export function ManifestLayout(props: ManifestLayoutProps) {
  return useIsMobile()
    ? <MobileLayout {...props} />
    : <DesktopLayout {...props} />;
}
