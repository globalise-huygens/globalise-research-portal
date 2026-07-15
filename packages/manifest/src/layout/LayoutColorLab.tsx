import { useEffect, useMemo, useState } from 'react';
import './LayoutColorLab.css';

type Palette = {
  id: string;
  label: string;
  fill: string;
  stroke: string;
  text: string;
};

const palettes: Palette[] = [
  {
    id: 'warm',
    label: 'Warm brown',
    fill: '185 155 127',
    stroke: '78 65 53',
    text: '#5d4736',
  },
  {
    id: 'teal',
    label: 'Cool teal',
    fill: '128 219 227',
    stroke: '18 94 100',
    text: '#125e64',
  },
  {
    id: 'slate',
    label: 'Muted slate',
    fill: '204 204 218',
    stroke: '82 74 94',
    text: '#524a5e',
  },
  {
    id: 'ink',
    label: 'Ink and white',
    fill: '255 255 255',
    stroke: '38 38 38',
    text: '#262626',
  },
];

const defaultPalette = 'warm';

export function LayoutColorLab() {
  const initialParams = new URLSearchParams(window.location.search);
  const initialPalette = initialParams.get('layoutPalette') ?? defaultPalette;
  const [paletteId, setPaletteId] = useState(initialPalette);
  const [fillStrength, setFillStrength] = useState(
    getInitialStrength(initialParams, 'layoutFill', 14, 0, 40),
  );
  const [outlineStrength, setOutlineStrength] = useState(
    getInitialStrength(initialParams, 'layoutOutline', 72, 30, 100),
  );
  const palette = palettes.find(({ id }) => id === paletteId) ?? palettes[0];

  const variables = useMemo(() => {
    const fill = fillStrength / 100;
    const fillStrong = Math.min(fill + 0.14, 0.6);
    const stroke = outlineStrength / 100;
    const strokeStrong = Math.min(stroke + 0.2, 1);
    return {
      '--color-layout-element-fill': `rgb(${palette.fill} / ${fill})`,
      '--color-layout-element-fill-strong': `rgb(${palette.fill} / ${fillStrong})`,
      '--color-layout-element-stroke': `rgb(${palette.stroke} / ${stroke})`,
      '--color-layout-element-stroke-strong': `rgb(${palette.stroke} / ${strokeStrong})`,
      '--color-layout-element-text': palette.text,
    };
  }, [fillStrength, outlineStrength, palette]);

  useEffect(() => {
    const viewer = document.querySelector<HTMLElement>('.manifest-document-layout');
    if (!viewer) {
      return;
    }
    for (const [property, value] of Object.entries(variables)) {
      viewer.style.setProperty(property, value);
    }

    const url = new URL(window.location.href);
    url.searchParams.set('layoutPalette', palette.id);
    url.searchParams.set('layoutFill', String(fillStrength));
    url.searchParams.set('layoutOutline', String(outlineStrength));
    window.history.replaceState({}, '', url);

    return () => {
      for (const property of Object.keys(variables)) {
        viewer.style.removeProperty(property);
      }
    };
  }, [fillStrength, outlineStrength, palette.id, variables]);

  return (
    <aside className="manifest-layout-color-lab" aria-label="Layout color lab">
      <div className="manifest-layout-color-lab__heading">
        Layout color lab
      </div>
      <div className="manifest-layout-color-lab__palettes">
        {palettes.map((option) => (
          <button
            key={option.id}
            type="button"
            className="manifest-layout-color-lab__palette"
            aria-pressed={option.id === palette.id}
            onClick={() => setPaletteId(option.id)}
          >
            <span
              className="manifest-layout-color-lab__swatch"
              style={{
                background: `rgb(${option.fill} / 0.4)`,
                borderColor: `rgb(${option.stroke})`,
              }}
            />
            {option.label}
          </button>
        ))}
      </div>
      <label className="manifest-layout-color-lab__control">
        <span>Fill <output>{fillStrength}%</output></span>
        <input
          type="range"
          min="0"
          max="40"
          value={fillStrength}
          onChange={(event) => setFillStrength(Number(event.currentTarget.value))}
        />
      </label>
      <label className="manifest-layout-color-lab__control">
        <span>Outline <output>{outlineStrength}%</output></span>
        <input
          type="range"
          min="30"
          max="100"
          value={outlineStrength}
          onChange={(event) => setOutlineStrength(Number(event.currentTarget.value))}
        />
      </label>
      <p className="manifest-layout-color-lab__hint">
        Switch transcription mode to compare the same palette in all views.
      </p>
    </aside>
  );
}

function getInitialStrength(
  params: URLSearchParams,
  name: string,
  fallback: number,
  min: number,
  max: number,
) {
  if (!params.has(name)) {
    return fallback;
  }
  const parsed = Number(params.get(name));
  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
}
