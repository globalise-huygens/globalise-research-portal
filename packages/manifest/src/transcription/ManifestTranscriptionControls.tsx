import { Button } from '@globalise/design';
import {
  setDiplomaticViewScale,
  setTranscriptionMode,
  useDiplomaticViewScale,
  useTranscriptionMode,
} from '@globalise/document';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

export function ManifestTranscriptionControls() {
  const transcriptionMode = useTranscriptionMode();
  const diplomaticViewScale = useDiplomaticViewScale();
  const showDiplomatic = transcriptionMode === 'diplomatic';

  return (
    <>
      {showDiplomatic && (
        <span className="zoom-slider">
          <ZoomOutIcon
            className="icon"
            fontSize="small"
            onClick={() =>
              setDiplomaticViewScale(Math.max(30, diplomaticViewScale - 10))
            }
          />
          <input
            type="range"
            min={30}
            max={200}
            value={diplomaticViewScale}
            onChange={(e) => setDiplomaticViewScale(parseInt(e.target.value))}
          />
          <ZoomInIcon
            className="icon"
            fontSize="small"
            onClick={() =>
              setDiplomaticViewScale(Math.min(200, diplomaticViewScale + 10))
            }
          />
        </span>
      )}
      <Button
        size="sm"
        className={showDiplomatic ? 'active' : ''}
        onClick={() => setTranscriptionMode('diplomatic')}
      >
        Diplomatic
      </Button>
      <Button
        size="sm"
        className={!showDiplomatic ? 'active' : ''}
        onClick={() => setTranscriptionMode('line-by-line')}
      >
        Line by line
      </Button>
    </>
  );
}
