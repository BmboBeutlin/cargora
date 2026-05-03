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

// 17px Frame-Breite passt mathematisch (680/40 = 17).
// Sheet-Höhe 48 in einer Reihe = 1 Truck pro Frame.
// 40 Frames total. Layout vermutlich: 5 Farben × 8 Headings = 40, oder andere Aufteilung.
export const VEHICLE_FRAME_W = 17;
export const VEHICLE_FRAME_H = 48;
export const VEHICLE_FRAME_COUNT = 40;

// Sheet-Layout (versuchsweise): 10 Farben × 4 Headings = 40 Frames.
// Pro Farbe 4 zusammenhängende Frames in Reihenfolge NW, NE, SE, SW.
// Wir nehmen Farbe 0 (Rot) als Standard-LKW (Frames 0-3).
export const HEADING_FRAME_MAP: Record<Heading, number> = {
  nw: 0,
  ne: 1,
  se: 2,
  sw: 3,
};

export const VEHICLE_TEXTURE_KEY = 'vehicles-sheet';
