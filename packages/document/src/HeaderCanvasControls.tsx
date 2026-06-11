import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useCanvasNavigation } from '@globalise/facsimile';

import './HeaderCanvasControls.css';
import { HeaderRegion } from './header';

export function HeaderCanvasControls() {
  const {
    isReady,
    prev,
    next,
    goToRandom,
    label,
    position,
    hasPrev,
    hasNext,
  } = useCanvasNavigation();
  if (!isReady) {
    return null;
  }

  return (
    <HeaderRegion region="left">
      <button onClick={prev} disabled={!hasPrev}>
        <NavigateBeforeIcon fontSize="small"/>
      </button>
      <span className="canvas-info">{label}&nbsp;{position}</span>
      <button onClick={goToRandom}>
        I'm Feeling Lucky
      </button>
      <button onClick={next} disabled={!hasNext}>
        <NavigateNextIcon fontSize="small"/>
      </button>
    </HeaderRegion>
  );
}