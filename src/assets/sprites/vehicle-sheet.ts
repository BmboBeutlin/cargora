/**
 * Vehicle-Sheet-Loader für vehicles.png (680x48, 17 Frames à 40x48).
 *
 * Heading-Mapping (PROVISORISCH — Patrick verifiziert via Inspector):
 *   se = Frame 0 (rechts-unten, Welt X+)
 *   ne = Frame 1 (rechts-oben, Welt Y-)
 *   nw = Frame 2 (links-oben, Welt X-)
 *   sw = Frame 3 (links-unten, Welt Y+)
 * Frames 4-15: weitere Farb-Varianten in derselben Heading-Reihenfolge.
 * Frame 16: Bonus / Spezial.
 *
 * Falls das Mapping falsch ist: HEADING_FRAME_MAP anpassen.
 */

import type { Heading } from './truck';

export const VEHICLE_SHEET_PATH = '/sprites/vehicles.png';

export const VEHICLE_FRAME_W = 40;
export const VEHICLE_FRAME_H = 48;
export const VEHICLE_FRAME_COUNT = 17;

// Color-Variant 0 (Frames 0-3): provisorische Heading-Zuordnung.
// Wenn Patrick im Inspector sagt "Frame 5 ist eigentlich SE", anpassen.
export const HEADING_FRAME_MAP: Record<Heading, number> = {
  se: 0,
  ne: 1,
  nw: 2,
  sw: 3,
};

export const VEHICLE_TEXTURE_KEY = 'vehicles-sheet';
