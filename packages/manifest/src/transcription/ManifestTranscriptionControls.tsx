import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {
  setDiplomaticViewScale,
  setTranscriptionMode,
  useSettings,
} from '@globalise/document';

export function ManifestTranscriptionControls() {
  const { transcriptionMode, diplomaticViewScale } = useSettings();
  const showDiplomatic = transcriptionMode === 'diplomatic';

  return (
    <>
      {showDiplomatic && (
        <span className="zoom-slider">
          <ZoomOutIcon
            className="icon"
            fontSize="small"
            onClick={() => { setDiplomaticViewScale(Math.max(30, diplomaticViewScale - 10)); }}
          />
          <input
            type="range"
            min={30}
            max={200}
            value={diplomaticViewScale}
            onChange={(e) => { setDiplomaticViewScale(parseInt(e.target.value)); }}
          />
          <ZoomInIcon
            className="icon"
            fontSize="small"
            onClick={() => { setDiplomaticViewScale(Math.min(200, diplomaticViewScale + 10)); }}
          />
        </span>
      )}
      <button
        className={showDiplomatic ? 'active' : ''}
        onClick={() => { setTranscriptionMode('diplomatic'); }}
      >
        Diplomatic
      </button>
      <button
        className={!showDiplomatic ? 'active' : ''}
        onClick={() => { setTranscriptionMode('line-by-line'); }}
      >
        Line by line
      </button>
    </>
  );
}