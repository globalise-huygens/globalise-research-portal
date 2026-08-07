import { createRoot } from 'react-dom/client';
import { initCanvases } from '@globalise/common/document';
import { ScanOverlayDemo } from './ScanOverlayDemo.tsx';
import { canvasId } from './loadAnnotationPages';

initCanvases([canvasId]);

const $root = document.getElementById('root');
if (!$root) {
  throw new Error('No #root');
}
createRoot($root).render(<ScanOverlayDemo/>);