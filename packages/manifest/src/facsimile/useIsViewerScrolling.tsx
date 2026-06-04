import {useEffect, useState} from 'react';
import {useViewer} from '@knaw-huc/osd-iiif-viewer';

export function useIsViewerScrolling() {
  const viewer = useViewer();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!viewer) {
      return;
    }

    const onStart = () => setIsScrolling(true);
    const onFinish = () => setIsScrolling(false);

    viewer.addHandler('animation-start', onStart);
    viewer.addHandler('animation-finish', onFinish);

    return () => {
      viewer.removeHandler('animation-start', onStart);
      viewer.removeHandler('animation-finish', onFinish);
    };
  }, [viewer]);

  return isScrolling;
}
