// @ts-nocheck

import React from "react";

function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  className?: string;
}) {
  const styles =
    variant === "secondary"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : "bg-slate-900 text-white";

  return (
    <span className={`inline-flex items-center border px-2 py-1 text-xs font-medium ${styles} ${className}`}>
      {children}
    </span>
  );
}

const ULTRASOUND_ZOOM = 1.10;

function transformX(x: number) {
  return 50 + (x - 50) * ULTRASOUND_ZOOM;
}

function transformY(y: number) {
  // Zoom first, then translate downward to simulate deeper imaging.
  return y * ULTRASOUND_ZOOM - 14;
}

function nX(x: number, width: number) {
  return (transformX(x) / 100) * width;
}

function nY(y: number, height: number) {
  return height - (transformY(y) / 100) * height;
}

function nMove(x: number, y: number, width: number, height: number) {
  return `M ${nX(x, width).toFixed(1)} ${nY(y, height).toFixed(1)}`;
}

function nCubic(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  width: number,
  height: number
) {
  return `C ${nX(x1, width).toFixed(1)} ${nY(y1, height).toFixed(1)}, ${nX(x2, width).toFixed(1)} ${nY(y2, height).toFixed(1)}, ${nX(x, width).toFixed(1)} ${nY(y, height).toFixed(1)}`;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "%",
  digits = 0,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
  digits?: number;
}) {
  return (
    <label className="block rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-800">{label}</span>
        <span className="rounded-xl bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
          {value.toFixed(digits)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-slate-900"
      />
    </label>
  );
}

function pointCircle([x, y]: number[], width: number, height: number, key: string, fill: string) {
  return (
    <circle
      key={key}
      cx={nX(x, width)}
      cy={nY(y, height)}
      r="2"
      fill={fill}
      opacity="0.88"
    />
  );
}

function polygonPath(points: number[][], width: number, height: number) {
  return points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${nX(x, width).toFixed(1)} ${nY(y, height).toFixed(1)}`)
    .join(" ") + " Z";
}

const landmarkPoints = {
  posteriorEpicardium: [
    [55.0, 23.2],
    [42.5, 20.3],
    [24.8, 28.3],
    [11.5, 43.7],
  ],
  posteriorEndocardium: [
    [50.2, 27.3],
    [38.8, 28.0],
    [24.6, 38.3],
    [14.5, 48.8],
  ],
  septalLvSide: [
    [54.8, 62.3],
    [48.1, 63.7],
    [34.6, 70.0],
    [28.2, 71.7],
  ],
  septalRvSide: [
    [55.7, 64.3],
    [51.8, 68.1],
    [36.8, 73.2],
    [29.4, 73.8],
  ],
  rvEndocardium: [
    [55.25, 89.46],
    [53.10, 87.65],
    [51.07, 86.75],
    [49.14, 87.05],
    [45.82, 87.65],
    [42.0, 87.65],
    [40.79, 87.80],
  ],
  rvEpicardium: [
    [55.67, 91.87],
    [54.07, 92.32],
    [51.61, 92.02],
    [49.04, 91.57],
    [47.22, 90.81],
    [45.29, 90.66],
    [43.47, 90.66],
    [41.76, 90.51],
  ],
};

function posteriorEpicardiumPath(width: number, height: number) {
  return [
    nMove(55.0, 23.2, width, height),
    nCubic(51.5, 21.0, 46.5, 19.3, 42.5, 20.3, width, height),
    nCubic(36.0, 21.2, 29.7, 24.8, 24.8, 28.3, width, height),
    nCubic(19.5, 32.2, 14.1, 37.3, 11.5, 43.7, width, height),
  ].join(" ");
}

function posteriorEndocardiumPath(width: number, height: number, contractility = 0, systolic = false) {
  const t = systolic ? contractility / 50 : 0;
  const inward = 3.6 * t;
  const upward = 1.45 * t;

  return [
    nMove(50.2 + inward, 27.3 + upward, width, height),
    nCubic(46.7 + inward, 25.7 + upward, 42.0 + inward, 27.2 + upward, 38.8 + inward, 28.0 + upward, width, height),
    nCubic(33.5 + inward * 0.95, 30.0 + upward, 29.2 + inward * 0.85, 33.8 + upward * 1.05, 24.6 + inward * 0.7, 38.3 + upward * 1.05, width, height),
    nCubic(20.5 + inward * 0.5, 42.2 + upward, 16.6 + inward * 0.35, 45.5 + upward * 0.7, 14.5 + inward * 0.25, 48.8 + upward * 0.4, width, height),
  ].join(" ");
}

function septalLvSidePath(width: number, height: number, contractility = 0, systolic = false, septalBow = 0) {
  const t = systolic ? contractility / 50 : 0;
  const inward = 2.0 * t;
  const downward = 1.0 * t;

  // Septal bowing rule: the rightward/basal points are nearly fixed, while the
  // mid/apical septum bows toward the LV cavity. In this coordinate system,
  // bowing toward the LV means mostly downward, with a small leftward component.
  const p = (x: number, y: number, bowFactor: number, thickFactor = 1) => [
    x - inward * thickFactor - 2.4 * septalBow * bowFactor,
    y - downward * thickFactor - 8.2 * septalBow * bowFactor,
  ];

  const [mX, mY] = p(54.8, 62.3, 0.08, 1);
  const [c1x, c1y] = p(52.8, 61.7, 0.18, 1);
  const [c2x, c2y] = p(50.1, 61.9, 0.28, 1);
  const [e1x, e1y] = p(48.1, 63.7, 0.4, 1);
  const [c3x, c3y] = p(43.7, 66.3, 0.68, 0.95);
  const [c4x, c4y] = p(38.1, 68.8, 0.88, 0.85);
  const [e2x, e2y] = p(34.6, 70.0, 1.0, 0.7);
  const [c5x, c5y] = p(31.8, 70.4, 1.0, 0.55);
  const [c6x, c6y] = p(29.5, 70.9, 1.0, 0.35);
  const [e3x, e3y] = p(28.2, 71.7, 1.0, 0.25);

  return [
    nMove(mX, mY, width, height),
    nCubic(c1x, c1y, c2x, c2y, e1x, e1y, width, height),
    nCubic(c3x, c3y, c4x, c4y, e2x, e2y, width, height),
    nCubic(c5x, c5y, c6x, c6y, e3x, e3y, width, height),
  ].join(" ");
}

function septalRvSidePath(width: number, height: number, septalBow = 0) {
  const p = (x: number, y: number, bowFactor: number) => [
    x - 2.0 * septalBow * bowFactor,
    y - 7.2 * septalBow * bowFactor,
  ];

  const [mX, mY] = p(55.7, 64.3, 0.05);
  const [c1x, c1y] = p(55.4, 66.2, 0.12);
  const [c2x, c2y] = p(53.5, 67.7, 0.22);
  const [e1x, e1y] = p(51.8, 68.1, 0.32);
  const [c3x, c3y] = p(47.3, 69.7, 0.6);
  const [c4x, c4y] = p(42.2, 71.1, 0.85);
  const [e2x, e2y] = p(36.8, 73.2, 1.0);
  const [c5x, c5y] = p(33.8, 74.0, 1.0);
  const [c6x, c6y] = p(31.0, 74.4, 1.0);
  const [e3x, e3y] = p(29.4, 73.8, 1.0);

  return [
    nMove(mX, mY, width, height),
    nCubic(c1x, c1y, c2x, c2y, e1x, e1y, width, height),
    nCubic(c3x, c3y, c4x, c4y, e2x, e2y, width, height),
    nCubic(c5x, c5y, c6x, c6y, e3x, e3y, width, height),
  ].join(" ");
}

function rvEpicardiumPath(width: number, height: number) {
  return [
    nMove(55.7, 91.9, width, height),
    nCubic(54.2, 92.5, 52.2, 92.2, 51.0, 92.0, width, height),
    nCubic(48.6, 91.6, 47.2, 90.8, 45.3, 90.7, width, height),
    nCubic(44.0, 90.7, 42.6, 90.7, 41.8, 90.5, width, height),
  ].join(" ");
}

function rvEndocardiumPath(width: number, height: number, rvContractility = 0, systolic = false) {
  const t = systolic ? rvContractility / 50 : 0;
  // RV free wall thickening: endocardium moves inferiorly/toward the RV cavity.
  // Max slider value produces roughly 60% apparent wall thickening.
  const down = 1.85 * t;
  const inward = 0.9 * t;

  return [
    nMove(55.25 - inward * 0.3, 89.46 - down, width, height),
    nCubic(53.4 - inward * 0.4, 88.0 - down, 52.0 - inward * 0.6, 86.8 - down, 51.1 - inward * 0.7, 86.75 - down, width, height),
    nCubic(49.2 - inward * 0.9, 86.9 - down, 46.0 - inward, 87.5 - down, 43.9 - inward, 87.4 - down, width, height),
    nCubic(42.9 - inward, 87.4 - down * 0.9, 41.6 - inward * 0.9, 87.6 - down * 0.8, 40.8 - inward * 0.8, 87.8 - down * 0.7, width, height),
  ].join(" ");
}

function posteriorAorticWallPath(width: number, height: number) {
  return [
    nMove(75.3, 61.1, width, height),
    nCubic(73.0, 59.6, 71.4, 57.8, 70.1, 56.5, width, height),
    nCubic(68.9, 55.0, 68.2, 53.4, 67.1, 52.4, width, height),
    nCubic(65.6, 51.1, 63.5, 50.6, 61.7, 51.1, width, height),
  ].join(" ");
}

function posteriorBasalHeartPath(width: number, height: number) {
  return [
    nMove(51.1, 29.2, width, height),
    nCubic(51.0, 27.4, 52.5, 25.4, 54.5, 24.5, width, height),
    nCubic(57.6, 23.7, 61.2, 26.0, 63.0, 29.5, width, height),
    nCubic(65.6, 31.0, 69.8, 32.3, 72.1, 33.6, width, height),
    nCubic(77.1, 36.6, 82.3, 41.1, 86.8, 45.9, width, height),
  ].join(" ");
}

function posteriorBasalTissueFillPath(width: number, height: number) {
  // Grey tissue bed posterior/inferior to the visible posterior LV wall and LA wall.
  // This intentionally extends to the sector edge so the region reads as tissue rather than black cavity.
  return polygonPath(
    [
      [51.1, 29.2],
      [54.5, 24.5],
      [57.3, 24.4],
      [63.0, 29.5],
      [72.1, 33.6],
      [80.7, 39.9],
      [86.8, 45.9],
      [92.0, 100.0],
      [4.0, 100.0],
      [11.5, 43.7],
      [24.8, 28.3],
      [42.5, 20.3],
    ],
    width,
    height
  );
}

function anteriorAorticWallPath(width: number, height: number) {
  return [
    nMove(54.9, 63.0, width, height),
    nCubic(54.8, 64.4, 55.1, 66.0, 55.6, 66.9, width, height),
    nCubic(56.4, 68.7, 58.2, 69.6, 60.2, 70.3, width, height),
    nCubic(62.0, 71.4, 63.8, 70.8, 65.6, 72.1, width, height),
    nCubic(66.3, 72.7, 67.0, 73.2, 67.6, 73.6, width, height),
  ].join(" ");
}

function anteriorAorticValveLeafletClosedPath(width: number, height: number) {
  return [
    nMove(54.2, 62.0, width, height),
    nCubic(54.8, 61.2, 55.2, 60.1, 55.8, 59.0, width, height),
    nCubic(56.5, 58.2, 57.4, 57.8, 58.5, 58.0, width, height),
    nCubic(59.3, 58.2, 60.1, 58.2, 60.9, 58.0, width, height),
  ].join(" ");
}

function posteriorAorticValveLeafletClosedPath(width: number, height: number) {
  return [
    nMove(62.6, 51.5, width, height),
    nCubic(61.8, 51.7, 61.0, 52.4, 60.6, 53.0, width, height),
    nCubic(59.8, 53.6, 59.1, 55.0, 59.3, 56.5, width, height),
    nCubic(59.5, 57.3, 60.0, 58.1, 60.2, 59.2, width, height),
  ].join(" ");
}

function anteriorMitralLeafletOpenPath(width: number, height: number) {
  return [
    nMove(47.4, 39.8, width, height),
    nCubic(49.0, 39.5, 51.8, 38.0, 54.2, 35.8, width, height),
    nCubic(56.0, 34.1, 57.8, 32.5, 59.6, 31.5, width, height),
  ].join(" ");
}

function anteriorMitralLeafletClosedPath(width: number, height: number) {
  return [
    nMove(47.4, 39.8, width, height),
    nCubic(49.0, 41.0, 51.8, 42.5, 54.0, 43.4, width, height),
    nCubic(55.6, 44.1, 57.0, 44.6, 58.2, 44.7, width, height),
  ].join(" ");
}

function posteriorMitralLeafletOpenPath(width: number, height: number) {
  return [
    nMove(47.1, 36.7, width, height),
    nCubic(48.2, 36.0, 49.7, 34.6, 50.7, 32.2, width, height),
    nCubic(51.9, 29.8, 54.5, 27.7, 56.9, 27.0, width, height),
    nCubic(58.2, 26.8, 59.5, 26.9, 60.6, 27.1, width, height),
  ].join(" ");
}

function posteriorMitralLeafletClosedPath(width: number, height: number) {
  return [
    nMove(47.1, 36.7, width, height),
    nCubic(48.2, 36.0, 49.7, 34.6, 50.7, 32.2, width, height),
    nCubic(51.9, 29.8, 54.5, 27.7, 56.9, 27.0, width, height),
    nCubic(58.2, 26.8, 59.5, 26.9, 60.6, 27.1, width, height),
  ].join(" ");
}

function mitralTipClosedPath(width: number, height: number) {
  return [
    nMove(47.43, 38.10, width, height),
    nCubic(47.43, 38.10, 47.43, 38.10, 47.43, 38.10, width, height),
  ].join(" ");
}

function mitralTipSystolicPath(width: number, height: number) {
  // Both mitral leaflet tips coapt at this point during systole.
  return [
    nMove(47.43, 38.10, width, height),
    nCubic(47.43, 38.10, 47.43, 38.10, 47.43, 38.10, width, height),
  ].join(" ");
}

function anteriorMitralTipPath(width: number, height: number, tipX: number, tipY: number) {
  // Anterior leaflet motion gradient:
  // base/curtain fixed, mid-leaflet moves ~30%, tip moves 100%.
  const base = [62.96, 50.90];
  const mid1Open = [57.17, 48.49];
  const mid2Open = [53.53, 45.93];
  const tipOpen = [47.43, 39.76];
  const dx = tipX - tipOpen[0];
  const dy = tipY - tipOpen[1];

  const mid1 = [mid1Open[0] + dx * 0.12, mid1Open[1] + dy * 0.12];
  const mid2 = [mid2Open[0] + dx * 0.32, mid2Open[1] + dy * 0.32];

  return [
    nMove(base[0], base[1], width, height),
    nCubic(61.6, 50.2, 60.5, 49.7, 59.85, 49.40, width, height),
    nCubic(58.7 + dx * 0.08, 49.0 + dy * 0.08, 57.8 + dx * 0.1, 48.7 + dy * 0.1, mid1[0], mid1[1], width, height),
    nCubic(55.8 + dx * 0.2, 47.7 + dy * 0.2, 54.5 + dx * 0.28, 46.7 + dy * 0.28, mid2[0], mid2[1], width, height),
    nCubic(52.4 + dx * 0.42, 44.9 + dy * 0.42, 50.5 + dx * 0.68, 42.2 + dy * 0.68, tipX, tipY, width, height),
  ].join(" ");
}

function posteriorMitralTipPath(width: number, height: number, tipX: number, tipY: number) {
  // Posterior leaflet motion gradient:
  // basal/LA-wall side fixed, mid-leaflet moves mildly, tip moves 100%.
  const base = [60.60, 27.11];
  const mid1Open = [56.85, 26.96];
  const mid2Open = [50.75, 32.23];
  const tipOpen = [47.11, 36.75];
  const dx = tipX - tipOpen[0];
  const dy = tipY - tipOpen[1];

  const mid1 = [mid1Open[0] + dx * 0.06, mid1Open[1] + dy * 0.06];
  const mid2 = [mid2Open[0] + dx * 0.30, mid2Open[1] + dy * 0.30];

  return [
    nMove(base[0], base[1], width, height),
    nCubic(59.4 + dx * 0.04, 26.9 + dy * 0.04, 58.0 + dx * 0.05, 26.8 + dy * 0.05, mid1[0], mid1[1], width, height),
    nCubic(54.4 + dx * 0.12, 27.8 + dy * 0.12, 51.5 + dx * 0.22, 30.1 + dy * 0.22, mid2[0], mid2[1], width, height),
    nCubic(49.7 + dx * 0.45, 34.6 + dy * 0.45, 48.2 + dx * 0.70, 36.0 + dy * 0.70, tipX, tipY, width, height),
  ].join(" ");
}

function mitralTipOpenPath(width: number, height: number) {
  return [
    nMove(47.43, 39.76, width, height),
    nCubic(47.34, 38.85, 47.20, 37.65, 47.11, 36.75, width, height),
  ].join(" ");
}

function anteriorMitralCurtainPath(width: number, height: number) {
  return [
    nMove(63.0, 50.9, width, height),
    nCubic(60.0, 49.4, 57.2, 48.5, 53.5, 45.9, width, height),
    nCubic(51.7, 44.1, 50.3, 42.0, 48.7, 40.1, width, height),
    nCubic(48.2, 39.6, 47.8, 39.6, 47.4, 39.8, width, height),
  ].join(" ");
}

function posteriorMitralLeafletLaWallPath(width: number, height: number) {
  return [
    nMove(47.1, 36.7, width, height),
    nCubic(48.2, 36.0, 49.7, 34.6, 50.7, 32.2, width, height),
    nCubic(51.9, 29.8, 54.5, 27.7, 56.9, 27.0, width, height),
    nCubic(59.0, 26.8, 61.3, 27.2, 62.8, 28.0, width, height),
  ].join(" ");
}

function posteriorLeftAtrialWallPath(width: number, height: number) {
  return [
    nMove(88.8, 44.6, width, height),
    nCubic(86.8, 41.7, 84.4, 39.7, 81.0, 36.9, width, height),
    nCubic(76.4, 34.2, 72.0, 31.2, 67.5, 28.9, width, height),
    nCubic(62.9, 26.1, 59.9, 24.1, 56.5, 22.9, width, height),
    nCubic(54.4, 22.4, 52.6, 23.0, 51.1, 24.2, width, height),
    nCubic(49.8, 25.9, 48.5, 27.4, 50.0, 28.2, width, height),
  ].join(" ");
}

function anteriorAorticValveLeafletOpenPath(width: number, height: number) {
  return [
    nMove(54.3, 61.9, width, height),
    nCubic(55.0, 61.4, 55.9, 61.6, 57.4, 61.9, width, height),
    nCubic(58.5, 62.2, 59.3, 63.2, 60.0, 64.0, width, height),
    nCubic(60.8, 64.5, 61.4, 64.9, 61.8, 65.2, width, height),
  ].join(" ");
}

function posteriorAorticValveLeafletOpenPath(width: number, height: number) {
  return [
    nMove(62.5, 51.5, width, height),
    nCubic(62.5, 52.2, 62.7, 53.5, 62.8, 54.2, width, height),
    nCubic(63.0, 54.7, 63.8, 55.6, 64.5, 56.3, width, height),
    nCubic(65.2, 57.2, 65.9, 57.8, 66.3, 58.3, width, height),
  ].join(" ");
}

function getAvOpeningPattern(openingFraction: number) {
  if (openingFraction >= 0.85) return { display: "1/1", sub: "Opens every beat", beats: 1 };
  if (openingFraction >= 0.55) return { display: "1/2", sub: "Opens every 2 beats", beats: 2 };
  if (openingFraction >= 0.35) return { display: "1/3", sub: "Opens every 3 beats", beats: 3 };
  if (openingFraction >= 0.15) return { display: "1/4", sub: "Opens every 4 beats", beats: 4 };
  return { display: "Closed", sub: "No effective AV opening", beats: 1 };
}

function PlaxUltrasoundBackground({ contractility, rvContractility, cvpPcwpRatio, avOpeningFraction }: { contractility: number; rvContractility: number; cvpPcwpRatio: number; avOpeningFraction: number }) {
  const width = 520;
  const height = 330;
  const apexX = width / 2;
  const apexY = -8;
  const leftFarX = 60;
  const rightFarX = width - 60;
  const farY = 322;

  const systolicPosteriorEndocardium = landmarkPoints.posteriorEndocardium.map(([x, y], index) => {
    const t = contractility / 50;
    const inwardByIndex = [3.6, 3.6, 2.6, 0.9][index] ?? 1;
    const upwardByIndex = [1.45, 1.45, 1.25, 0.5][index] ?? 0.7;
    return [x + inwardByIndex * t, y + upwardByIndex * t];
  });

  const earlyBow = Math.max(0, (cvpPcwpRatio - 0.63) / (0.85 - 0.63));
  const lateBow = Math.max(0, (cvpPcwpRatio - 0.9) / (1.1 - 0.9));
  const septalDiastolicBow = Math.min(1.65, earlyBow + lateBow * 0.55);
  const systolicReturnLoss = Math.max(0, Math.min(1, lateBow));
  const septalSystolicBow = septalDiastolicBow * systolicReturnLoss;

  const bowLvPoint = ([x, y]: number[], index: number, bow: number, includeThickening: boolean) => {
    const t = includeThickening ? contractility / 50 : 0;
    const inwardByIndex = [2.0, 2.0, 1.4, 0.5][index] ?? 1;
    const downwardByIndex = [1.0, 1.0, 0.7, 0.15][index] ?? 0.5;
    const bowFactor = [0.08, 0.4, 1.0, 1.0][index] ?? 0.7;
    return [x - inwardByIndex * t - 2.4 * bow * bowFactor, y - downwardByIndex * t - 8.2 * bow * bowFactor];
  };

  const bowRvPoint = ([x, y]: number[], index: number, bow: number) => {
    const bowFactor = [0.05, 0.32, 1.0, 1.0][index] ?? 0.7;
    return [x - 2.0 * bow * bowFactor, y - 7.2 * bow * bowFactor];
  };

  const diastolicSeptalLvSide = landmarkPoints.septalLvSide.map((point, index) => bowLvPoint(point, index, septalDiastolicBow, false));
  const systolicSeptalLvSide = landmarkPoints.septalLvSide.map((point, index) => bowLvPoint(point, index, septalSystolicBow, true));
  const diastolicSeptalRvSide = landmarkPoints.septalRvSide.map((point, index) => bowRvPoint(point, index, septalDiastolicBow));
  const systolicSeptalRvSide = landmarkPoints.septalRvSide.map((point, index) => bowRvPoint(point, index, septalSystolicBow));

  const posteriorWallFillDiastole = polygonPath(
    [...landmarkPoints.posteriorEpicardium, ...landmarkPoints.posteriorEndocardium.slice().reverse()],
    width,
    height
  );

  const posteriorWallFillSystole = polygonPath(
    [...landmarkPoints.posteriorEpicardium, ...systolicPosteriorEndocardium.slice().reverse()],
    width,
    height
  );

  const septalWallFillDiastole = polygonPath(
    [...diastolicSeptalRvSide, ...diastolicSeptalLvSide.slice().reverse()],
    width,
    height
  );

  const septalWallFillSystole = polygonPath(
    [...systolicSeptalRvSide, ...systolicSeptalLvSide.slice().reverse()],
    width,
    height
  );

  const systolicRvEndocardium = landmarkPoints.rvEndocardium.map(([x, y], index) => {
    const t = rvContractility / 50;
    const downByIndex = [1.85, 1.85, 1.85, 1.75, 1.65, 1.5, 1.3][index] ?? 1.5;
    const inwardByIndex = [0.25, 0.4, 0.65, 0.85, 1.0, 1.0, 0.8][index] ?? 0.8;
    return [x - inwardByIndex * t, y - downByIndex * t];
  });

  const rvWallFillDiastole = polygonPath(
    [...landmarkPoints.rvEpicardium, ...landmarkPoints.rvEndocardium.slice().reverse()],
    width,
    height
  );

  const rvWallFillSystole = polygonPath(
    [...landmarkPoints.rvEpicardium, ...systolicRvEndocardium.slice().reverse()],
    width,
    height
  );

  const avPattern = getAvOpeningPattern(avOpeningFraction);
  const avCycleDuration = `${900 * avPattern.beats}ms`;
  const beatWindow = avPattern.beats;
  const avKeyTimes = `0;${(0.18 / beatWindow).toFixed(4)};${(0.28 / beatWindow).toFixed(4)};${(0.44 / beatWindow).toFixed(4)};${(0.55 / beatWindow).toFixed(4)};1`;
  const anteriorValveClosed = anteriorAorticValveLeafletClosedPath(width, height);
  const posteriorValveClosed = posteriorAorticValveLeafletClosedPath(width, height);
  const anteriorValveOpen = anteriorAorticValveLeafletOpenPath(width, height);
  const posteriorValveOpen = posteriorAorticValveLeafletOpenPath(width, height);

  return (
    <div className="rounded-2xl border border-slate-800 bg-black p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-white">Parasternal Long-Axis Echo Canvas</div>
          <div className="text-xs text-slate-400">Wall thickening + CVP:PCWP septal motion.</div>
        </div>
        <Badge variant="secondary" className="rounded-lg border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
          PLAX module draft
        </Badge>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-hidden rounded-2xl bg-black">
        <defs>
          <radialGradient id="plaxBeamGradient" cx="50%" cy="6%" r="92%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.62" />
            <stop offset="18%" stopColor="#1e293b" stopOpacity="0.48" />
            <stop offset="58%" stopColor="#020617" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="plaxDepthFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>

          <filter id="plaxSpeckle">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.14" />
            </feComponentTransfer>
          </filter>

          <clipPath id="plaxSectorClip">
            <path
              d={`M ${apexX} ${apexY}
                  L ${rightFarX} ${farY - 16}
                  Q ${apexX} ${height + 18} ${leftFarX} ${farY - 16}
                  Z`}
            />
          </clipPath>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="#000000" />

        <path
          d={`M ${apexX} ${apexY}
              L ${rightFarX} ${farY - 16}
              Q ${apexX} ${height + 18} ${leftFarX} ${farY - 16}
              Z`}
          fill="url(#plaxBeamGradient)"
          stroke="#1f2937"
          strokeWidth="2"
        />

        <g clipPath="url(#plaxSectorClip)">
          <rect x="0" y="0" width={width} height={height} filter="url(#plaxSpeckle)" opacity="0.9" />

          {Array.from({ length: 13 }, (_, index) => {
            const y = 50 + index * 20;
            const opacity = 0.12 - index * 0.005;
            return (
              <path
                key={`depth-line-${index}`}
                d={`M ${apexX - 16 - index * 12} ${y}
                    Q ${apexX} ${y + 14} ${apexX + 16 + index * 12} ${y}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity={Math.max(opacity, 0.035)}
              />
            );
          })}

          {Array.from({ length: 9 }, (_, index) => {
            const angle = -34 + index * 8.5;
            return (
              <line
                key={`scan-ray-${index}`}
                x1={apexX}
                y1={apexY}
                x2={apexX + 330 * Math.sin((angle * Math.PI) / 180)}
                y2={apexY + 330 * Math.cos((angle * Math.PI) / 180)}
                stroke="#64748b"
                strokeWidth="1"
                opacity="0.055"
              />
            );
          })}

          <rect x="0" y="0" width={width} height={height} fill="url(#plaxDepthFade)" opacity="0.32" />

          <path
            d={posteriorBasalHeartPath(width, height)}
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.72"
          />

          <path className="posterior-wall-fill" d={posteriorWallFillDiastole} fill="#e2e8f0" opacity="0.15">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${posteriorWallFillDiastole}; ${posteriorWallFillSystole}; ${posteriorWallFillDiastole}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>
          <path d={septalWallFillDiastole} fill="#cbd5e1" opacity="0.13">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${septalWallFillDiastole}; ${septalWallFillSystole}; ${septalWallFillDiastole}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>

          <path d={rvWallFillDiastole} fill="#e2e8f0" opacity="0.12">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${rvWallFillDiastole}; ${rvWallFillSystole}; ${rvWallFillDiastole}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>

          <path
            d={posteriorAorticWallPath(width, height)}
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          <path
            d={anteriorAorticWallPath(width, height)}
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          <path
            d={anteriorMitralTipPath(width, height, 47.43, 39.76)}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.98"
          >
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${anteriorMitralTipPath(width, height, 47.43, 39.76)}; ${anteriorMitralTipPath(width, height, 47.43, 39.76)}; ${anteriorMitralTipPath(width, height, 47.43, 38.10)}; ${anteriorMitralTipPath(width, height, 47.43, 38.10)}; ${anteriorMitralTipPath(width, height, 47.43, 39.76)}`}
              keyTimes="0;0.16;0.30;0.55;1"
              calcMode="spline"
              keySplines="0 0 1 1; 0.42 0 0.58 1; 0 0 1 1; 0.42 0 0.58 1"
            />
          </path>

          <path
            d={posteriorMitralTipPath(width, height, 47.11, 36.75)}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.98"
          >
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${posteriorMitralTipPath(width, height, 47.11, 36.75)}; ${posteriorMitralTipPath(width, height, 47.11, 36.75)}; ${posteriorMitralTipPath(width, height, 47.43, 38.10)}; ${posteriorMitralTipPath(width, height, 47.43, 38.10)}; ${posteriorMitralTipPath(width, height, 47.11, 36.75)}`}
              keyTimes="0;0.16;0.30;0.55;1"
              calcMode="spline"
              keySplines="0 0 1 1; 0.42 0 0.58 1; 0 0 1 1; 0.42 0 0.58 1"
            />
          </path>

          <path
            d={anteriorValveClosed}
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          >
            {avOpeningFraction >= 0.15 ? (
              <animate
                attributeName="d"
                dur={avCycleDuration}
                repeatCount="indefinite"
                values={`${anteriorValveClosed}; ${anteriorValveClosed}; ${anteriorValveOpen}; ${anteriorValveOpen}; ${anteriorValveClosed}; ${anteriorValveClosed}`}
                keyTimes={avKeyTimes}
                calcMode="spline"
                keySplines="0 0 1 1; 0.42 0 0.58 1; 0 0 1 1; 0.42 0 0.58 1; 0 0 1 1"
              />
            ) : null}
          </path>

          <path
            d={posteriorValveClosed}
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          >
            {avOpeningFraction >= 0.15 ? (
              <animate
                attributeName="d"
                dur={avCycleDuration}
                repeatCount="indefinite"
                values={`${posteriorValveClosed}; ${posteriorValveClosed}; ${posteriorValveOpen}; ${posteriorValveOpen}; ${posteriorValveClosed}; ${posteriorValveClosed}`}
                keyTimes={avKeyTimes}
                calcMode="spline"
                keySplines="0 0 1 1; 0.42 0 0.58 1; 0 0 1 1; 0.42 0 0.58 1; 0 0 1 1"
              />
            ) : null}
          </path>

          <path d={posteriorEpicardiumPath(width, height)} fill="none" stroke="#f8fafc" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
          <path d={posteriorEndocardiumPath(width, height, contractility, false)} fill="none" stroke="#f8fafc" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${posteriorEndocardiumPath(width, height, contractility, false)}; ${posteriorEndocardiumPath(width, height, contractility, true)}; ${posteriorEndocardiumPath(width, height, contractility, false)}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>
          <path d={septalLvSidePath(width, height, contractility, false, septalDiastolicBow)} fill="none" stroke="#f8fafc" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${septalLvSidePath(width, height, contractility, false, septalDiastolicBow)}; ${septalLvSidePath(width, height, contractility, true, septalSystolicBow)}; ${septalLvSidePath(width, height, contractility, false, septalDiastolicBow)}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>
          <path d={septalRvSidePath(width, height, septalDiastolicBow)} fill="none" stroke="#f8fafc" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.82">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${septalRvSidePath(width, height, septalDiastolicBow)}; ${septalRvSidePath(width, height, septalSystolicBow)}; ${septalRvSidePath(width, height, septalDiastolicBow)}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>
          <path d={rvEpicardiumPath(width, height)} fill="none" stroke="#f8fafc" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
          <path d={rvEndocardiumPath(width, height, rvContractility, false)} fill="none" stroke="#f8fafc" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            <animate
              attributeName="d"
              dur="900ms"
              repeatCount="indefinite"
              values={`${rvEndocardiumPath(width, height, rvContractility, false)}; ${rvEndocardiumPath(width, height, rvContractility, true)}; ${rvEndocardiumPath(width, height, rvContractility, false)}`}
              keyTimes="0;0.38;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>

          {landmarkPoints.posteriorEpicardium.map((point, index) => pointCircle(point, width, height, `pe-${index}`, "#38bdf8"))}
          {landmarkPoints.posteriorEndocardium.map((point, index) => pointCircle(point, width, height, `pi-${index}`, "#f97316"))}
          {landmarkPoints.septalRvSide.map((point, index) => pointCircle(point, width, height, `sr-${index}`, "#22c55e"))}
          {landmarkPoints.septalLvSide.map((point, index) => pointCircle(point, width, height, `sl-${index}`, "#a78bfa"))}
          {landmarkPoints.rvEndocardium.map((point, index) => pointCircle(point, width, height, `rv-endo-${index}`, "#facc15"))}
          {landmarkPoints.rvEpicardium.map((point, index) => pointCircle(point, width, height, `rv-epi-${index}`, "#14b8a6"))}
        </g>

        <text x="18" y="28" className="fill-slate-500 text-[10px] font-bold tracking-wide">
          PLAX
        </text>
        <text x="18" y="42" className="fill-slate-600 text-[9px] font-semibold">
          vector anatomy draft
        </text>
        <text x="18" y="56" className="fill-slate-400 text-[9px] font-bold">
          AV {avPattern.display}: {avPattern.sub}
        </text>
      </svg>
    </div>
  );
}

export default function PlaxEchoImageCard({
  lvContractility = 25,
  rvContractility = 25,
  cvpPcwpRatio = 0.6,
  avOpeningFraction = 0.85,
  hMin = 999,
}) {
  const effectiveAvOpeningFraction = hMin <= 1 ? Math.max(avOpeningFraction, 0.15) : avOpeningFraction;

  return (
    <PlaxUltrasoundBackground
      contractility={lvContractility}
      rvContractility={rvContractility}
      cvpPcwpRatio={cvpPcwpRatio}
      avOpeningFraction={effectiveAvOpeningFraction}
    />
  );
}
