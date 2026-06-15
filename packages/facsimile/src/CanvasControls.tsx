import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useCanvasNavigation } from './useCanvasNavigation';

export function CanvasControls() {
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
    <div className="navigation">
      <span className="info">{label}&nbsp;{position}</span>
      <div className="control-bar">
        <button onClick={prev} disabled={!hasPrev}>
          <NavigateBeforeIcon/>
        </button>
        <button onClick={goToRandom}>
          I'm Feeling Lucky
        </button>
        <button onClick={next} disabled={!hasNext}>
          <NavigateNextIcon/>
        </button>
      </div>
    </div>
  );
}