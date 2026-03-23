import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

/**
 * State family tracking expanded state of hazard accordions.
 * Keyed by hazard title/identifier.
 */
export const hazardAccordionExpandedState = atomFamily(() => {
  return atom(false);
});

/**
 * Tracks which accordion is currently open (for single-accordion mode).
 * Set to null if no accordion is open or if multiple can be open.
 */
export const openAccordionState = atom<string | null>(null as string | null);

/**
 * Configuration: Set to false to allow multiple accordions open at once.
 * Set to true to enforce only one accordion open at a time.
 */
export const SINGLE_ACCORDION_MODE = true;
