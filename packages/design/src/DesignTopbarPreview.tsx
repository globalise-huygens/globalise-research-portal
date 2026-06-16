import { HeaderBar, HeaderProvider, HeaderRegion } from '@globalise/document';
import {
  Button,
  Input,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-aria-components';

function DocumentHeaderControls() {
  return (
    <>
      <HeaderRegion region="left">
        <Button type="button" isDisabled aria-label="Previous canvas">
          Prev
        </Button>
        <span className="canvas-info">Page 12&nbsp;of&nbsp;48</span>
        <Button type="button">I'm Feeling Lucky</Button>
        <Button type="button" aria-label="Next canvas">
          Next
        </Button>
      </HeaderRegion>

      <HeaderRegion region="center">
        <div className="manifest-dropdown">
          <Input
            aria-label="Selected manifest"
            readOnly
            title="A handwritten voyage report from the Globalise collection"
            value="A handwritten voyage report from the Globalise collection"
          />
        </div>
      </HeaderRegion>

      <HeaderRegion region="right">
        <ToggleButtonGroup
          className="topbar-segmented"
          defaultSelectedKeys={['transcription']}
          selectionMode="single"
        >
          <ToggleButton id="transcription">Text</ToggleButton>
          <ToggleButton id="facsimile">Scan</ToggleButton>
          <ToggleButton id="split">Split</ToggleButton>
          <ToggleButton id="minimap">Map</ToggleButton>
        </ToggleButtonGroup>
      </HeaderRegion>
    </>
  );
}

export function DesignTopbarPreview() {
  return (
    <main className="design-preview">
      <div className="design-preview__modal">
        <div className="document-view design-preview__dialog">
          <HeaderProvider>
            <HeaderBar />
            <DocumentHeaderControls />
          </HeaderProvider>
        </div>
      </div>
    </main>
  );
}
