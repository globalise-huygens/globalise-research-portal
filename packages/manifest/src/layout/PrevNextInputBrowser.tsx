import { clamp } from '@globalise/common';
import { IconLeft, IconRight } from '@globalise/design';
import { useState } from 'react';
import { BOTTOM_BAR_BUTTON } from './buttonClasses.ts';
import { TooltipIconButton } from './TooltipIconButton.tsx';

export type PrevNextInputBrowserProps = {
  label: string;
  name: string;
  index: number;
  total: number;
  onSelect: (index: number) => void;
};

export function PrevNextInputBrowser({ label, name, index, total, onSelect }: PrevNextInputBrowserProps) {
  const [input, setInput] = useState<string | null>(null);

  const inputValue = input ?? String(index + 1);
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  function select(nextIndex: number) {
    setInput(null);
    onSelect(nextIndex);
  }

  function selectFromInput() {
    const number = Number.parseInt(inputValue, 10);
    if (Number.isNaN(number)) {
      setInput(null);
      return;
    }
    select(clamp(number, 1, total) - 1);
  }

  function handleInputChange(value: string) {
    setInput(
      value.replace(/[^\d]/g, '').slice(0, String(total).length),
    );
  }

  return (
    <>
      <TooltipIconButton
        aria-label={`Previous ${name}`}
        tooltip={`Go to previous ${name}`}
        tooltipPlacement="top"
        isDisabled={!hasPrev}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconLeft className="h-s16 w-s16" />}
        onPress={() => select(index - 1)}
      />

      <span className="scan-position">
        <span>{label}</span>
        <input
          aria-label={`Current ${name} number, 1 to ${total}`}
          className="scan-position-input"
          inputMode="numeric"
          maxLength={String(total).length}
          pattern="[0-9]*"
          style={{ width: `${Math.max(2, String(total).length)}ch` }}
          type="text"
          value={inputValue}
          onBlur={selectFromInput}
          onChange={(event) => {
            handleInputChange(event.currentTarget.value);
          }}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              selectFromInput();
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setInput(null);
              event.currentTarget.blur();
            }
          }}
        />
        <span>of {total}</span>
      </span>

      <TooltipIconButton
        aria-label={`Next ${name}`}
        tooltip={`Go to next ${name}`}
        tooltipPlacement="top"
        isDisabled={!hasNext}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconRight className="h-s16 w-s16" />}
        onPress={() => select(index + 1)}
      />
    </>
  );
}
