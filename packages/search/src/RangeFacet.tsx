import { startTransition, useEffect, Suspense, useState, type CSSProperties } from 'react';
import { Slider, SliderTrack, SliderThumb, Group, Button, NumberField, Input, Label } from 'react-aria-components';
import { useFacet, useNumericRangeFacet } from '@knaw-huc/faceted-search-react';
import { cn, IconExpandSection } from '@globalise/design';
import Facet from './Facet';
import Histogram from './Histogram';
import classes from './RangeFacet.module.css';

export type Term = {
  start: number;
  end: number;
  count: number;
};

export default function RangeFacet({ facetKey }: { facetKey: string }) {
  const { label } = useFacet(facetKey, '');

  return (
    <Facet label={label}>
      <Suspense fallback={'Loading...'}>
        <RangeSlider facetKey={facetKey}/>
      </Suspense>
    </Facet>
  );
}

function RangeSlider({ facetKey }: { facetKey: string }) {
  const terms: Term[] = [
    { start: 1600, end: 1699, count: 500 },
    { start: 1700, end: 1799, count: 1000 },
    { start: 1800, end: 1899, count: 700 },
  ];
  const min = terms[0].start;
  const max = terms[terms.length - 1].end;
  const { value, onChange } = useNumericRangeFacet(facetKey, min, max);
  const [curMinMax, setCurMinMax] = useState<[number, number]>([min, max]);

  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurMinMax(value);
    }
  }, [value]);

  function onValueCommit(value: [number, number]) {
    if (value[0] < min) {
      value[0] = min;
    }
    if (value[1] > max) {
      value[1] = max;
    }
    setCurMinMax(value);
    onRangeChangeCommit(value[0], value[1]);
  }

  function onRangeChange(min: number, max: number) {
    setCurMinMax([min, max]);
    onRangeChangeCommit(min, max);
  }

  function onRangeChangeCommit(min: number, max: number) {
    startTransition(() => onChange(min, max));
  }

  return (
    <Slider aria-label="Range slider" value={curMinMax} minValue={min} maxValue={max} step={1}
      onChange={setCurMinMax} onChangeEnd={onValueCommit}>
      <Histogram terms={terms} selection={{ start: curMinMax[0], end: curMinMax[1] }}/>
      <RangeSliderTrack/>
      <RangeInputs min={min} max={max} curMinMax={curMinMax} onRangeChange={onRangeChange}/>
    </Slider>
  );
}

function RangeSliderTrack() {
  return (
    <SliderTrack className={classes.sliderTrack}>
      {({ state }) => <>
        <div className={classes.fill} style={{
          '--start': (state.getThumbPercent(0) * 100).toString() + '%',
          '--size': ((state.getThumbPercent(1) - state.getThumbPercent(0)) * 100).toString() + '%',
        } as CSSProperties}/>

        {['min', 'max'].map((key, idx) =>
          <SliderThumb key={key} index={idx} className={classes.thumb}/>,
        )}
      </>}
    </SliderTrack>
  );
}

function RangeInputs({ min, max, curMinMax, onRangeChange }: {
  min: number;
  max: number;
  curMinMax: [number, number];
  onRangeChange: (min: number, max: number) => void;
}) {
  return (
    <Group className={classes.rangeInputs}>
      <NumberInputSlot label="From" min={min} max={curMinMax[1]}
        current={curMinMax[0]} onChange={(value) => onRangeChange(value, curMinMax[1])}/>
      <NumberInputSlot label="To" min={curMinMax[0]} max={max}
        current={curMinMax[1]} onChange={(value) => onRangeChange(curMinMax[0], value)}/>
    </Group>
  );
}

function NumberInputSlot({ label, min, max, current, onChange }: {
  label: string;
  min: number;
  max: number;
  current: number,
  onChange: (value: number) => void
}) {
  return (
    <NumberField className={classes.numberInputSlot} formatOptions={{ useGrouping: false }}
      minValue={min} maxValue={max} step={1} value={current} onChange={onChange}>
      <Label>{label}</Label>

      <Group className={classes.numberInput}>
        <Input className={classes.input}/>

        <div className={classes.stepperButtons}>
          <StepperButton isIncrement={true}/>
          <StepperButton isIncrement={false}/>
        </div>
      </Group>
    </NumberField>
  );
}

function StepperButton({ isIncrement }: { isIncrement: boolean }) {
  return (
    <Button slot={isIncrement ? 'increment' : 'decrement'}
      className={cn(classes.button, isIncrement && classes.increment)}>
      <IconExpandSection/>
    </Button>
  );
}
