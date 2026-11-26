import { describe, expect, it } from 'vitest';
import {
  resolvePopoverAction,
  type PopoverCardOpening,
  type PopoverTriggerInput,
} from './usePopoverTrigger';

const openings: PopoverCardOpening[] = ['link', 'label', 'action'];

function resolve(
  opening: PopoverCardOpening,
  type: PopoverTriggerInput['type'],
  pointer: PopoverTriggerInput['pointer'],
) {
  return resolvePopoverAction(opening, { type, pointer });
}

describe('resolvePopoverAction', () => {
  describe('every opening', () => {
    it('opens after a delay when the mouse enters, and closes after a delay when it leaves', () => {
      for (const opening of openings) {
        expect(resolve(opening, 'enter', 'mouse')).toEqual({ type: 'open-delayed' });
        expect(resolve(opening, 'leave', 'mouse')).toEqual({ type: 'close-delayed' });
      }
    });

    it('ignores touch entering and leaving', () => {
      for (const opening of openings) {
        expect(resolve(opening, 'enter', 'touch')).toEqual({ type: 'none' });
        expect(resolve(opening, 'leave', 'touch')).toEqual({ type: 'none' });
      }
    });

    it('opens on keyboard focus and closes after a delay on blur', () => {
      for (const opening of openings) {
        expect(resolve(opening, 'focus', 'keyboard')).toEqual({ type: 'open' });
        expect(resolve(opening, 'blur', 'mouse')).toEqual({ type: 'close-delayed' });
      }
    });
  });

  describe('link', () => {
    it('opens on a tap instead of following the link', () => {
      expect(resolve('link', 'press', 'touch')).toEqual({ type: 'open', preventDefault: true });
    });

    it('leaves clicks and keyboard presses to the link', () => {
      expect(resolve('link', 'press', 'mouse')).toEqual({ type: 'none' });
      expect(resolve('link', 'press', 'keyboard')).toEqual({ type: 'none' });
    });
  });

  describe('label', () => {
    it('opens on clicks and keyboard presses', () => {
      expect(resolve('label', 'press', 'mouse')).toEqual({ type: 'open' });
      expect(resolve('label', 'press', 'keyboard')).toEqual({ type: 'open' });
    });

    it('opens on a tap instead of activating the label', () => {
      expect(resolve('label', 'press', 'touch')).toEqual({ type: 'open', preventDefault: true });
    });
  });

  describe('action', () => {
    it('leaves every press to the action', () => {
      expect(resolve('action', 'press', 'mouse')).toEqual({ type: 'none' });
      expect(resolve('action', 'press', 'keyboard')).toEqual({ type: 'none' });
      expect(resolve('action', 'press', 'touch')).toEqual({ type: 'none' });
    });

    it('does not open when a tap focuses it', () => {
      expect(resolve('action', 'focus', 'touch')).toEqual({ type: 'none' });
    });
  });
});
