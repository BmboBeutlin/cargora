import { TILE_INFO } from '../world/map';
import type { TileType } from '../world/map';

type HudData = {
  mode: string;
  tile: TileType;
  position: { x: number; y: number };
  flashMessage: string;
  hovered?: { tile: TileType; position: { x: number; y: number } } | null;
};

let flashOverride: { message: string; until: number } | null = null;

export function flashHud(message: string, durationMs: number): void {
  flashOverride = { message, until: performance.now() + durationMs };
}

export function renderHud(data: HudData): void {
  const el = document.getElementById('hud');
  if (!el) return;
  const info = TILE_INFO[data.tile];
  const speedPct = Math.round(info.speedMod * 100);
  const flashLine = data.flashMessage
    ? `<div style="color:#d97070;margin-top:6px">⚠ ${data.flashMessage}</div>`
    : '';
  const overrideLine = flashOverride && performance.now() < flashOverride.until
    ? `<div style="color:#d97070;margin-top:6px">⚠ ${flashOverride.message}</div>`
    : '';
  const hoverBlock = data.hovered
    ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.07)">
         <div style="color:#7a8494;font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em">Unter Cursor</div>
         <div style="color:#c8d0db;font-size:0.72rem;margin-top:2px">${TILE_INFO[data.hovered.tile].name} (${data.hovered.position.x}, ${data.hovered.position.y})</div>
       </div>`
    : '';
  el.innerHTML = `
    <div><b>CARGORA</b> · Stunde-1-Prototyp</div>
    <div style="margin-top:4px;color:#7a8494;font-size:0.7rem">Modus: ${data.mode}</div>
    <div style="color:#7a8494;font-size:0.7rem">LKW auf: ${info.name}</div>
    <div style="color:#7a8494;font-size:0.7rem">Speed-Modifier: ${speedPct}%</div>
    <div style="color:#7a8494;font-size:0.7rem">Position: (${data.position.x}, ${data.position.y})</div>
    <div style="margin-top:8px;color:#3a424e;font-size:0.65rem">Klick: fahren · Scroll: Zoom</div>
    ${hoverBlock}
    ${flashLine}${overrideLine}
  `;
}
