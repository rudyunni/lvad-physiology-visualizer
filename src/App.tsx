// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function Button({
  children,
  onClick,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition border";
  const styles =
    variant === "outline"
      ? "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
      : variant === "secondary"
      ? "bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200"
      : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

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

function Slider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
}: {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number[]) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(event) => onValueChange([Number(event.target.value)])}
      className="w-full accent-slate-900"
    />
  );
}


// LVAD FlowLab — conceptual HeartMate 3 HQ curve visualizer.
// Educational toy model only. Not a clinical decision-support tool.
// Icons are local inline SVGs so the app does not depend on lucide-react/CDN icon loading.

const FLOW_AXIS_MAX = 11;
const GRAPH_Y_MAX = 140;
const CURVE_POINTS = 121;
const AVAILABLE_RPMS = [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000];

const CURVE_FITS = {
  4500: {
    h0: 67.178,
    q0: 6.213,
    exponent: 2.539,
    label: "4500 RPM",
  },
  4600: {
    h0: 70.800,
    q0: 6.369,
    exponent: 2.499,
    label: "4600 RPM",
  },
  4700: {
    h0: 74.422,
    q0: 6.526,
    exponent: 2.459,
    label: "4700 RPM",
  },
  4800: {
    h0: 78.044,
    q0: 6.682,
    exponent: 2.418,
    label: "4800 RPM",
  },
  4900: {
    h0: 81.667,
    q0: 6.838,
    exponent: 2.378,
    label: "4900 RPM",
  },
  5000: {
    h0: 85.289,
    q0: 6.994,
    exponent: 2.338,
    label: "5000 RPM",
  },
  5100: {
    h0: 89.111,
    q0: 7.129,
    exponent: 2.363,
    label: "5100 RPM",
  },
  5200: {
    h0: 92.933,
    q0: 7.264,
    exponent: 2.389,
    label: "5200 RPM",
  },
  5300: {
    h0: 96.756,
    q0: 7.398,
    exponent: 2.414,
    label: "5300 RPM",
  },
  5400: {
    h0: 100.578,
    q0: 7.533,
    exponent: 2.44,
    label: "5400 RPM",
  },
  5500: {
    h0: 104.4,
    q0: 7.668,
    exponent: 2.465,
    label: "5500 RPM",
  },
  5600: {
    h0: 107.482,
    q0: 7.805,
    exponent: 2.531,
    label: "5600 RPM",
  },
  5700: {
    h0: 110.564,
    q0: 7.943,
    exponent: 2.597,
    label: "5700 RPM",
  },
  5800: {
    h0: 113.645,
    q0: 8.08,
    exponent: 2.664,
    label: "5800 RPM",
  },
  5900: {
    h0: 116.727,
    q0: 8.218,
    exponent: 2.73,
    label: "5900 RPM",
  },
  6000: {
    h0: 119.809,
    q0: 8.355,
    exponent: 2.796,
    label: "6000 RPM",
  },
};

const CASE_PRESETS = [
  {
    id: "hypertension",
    label: "Case 1: Hypertension / afterload",
    question: "Is this preload limitation or afterload limitation?",
    settings: { rpm: 5400, map: 100, lvPreload: 15, rvPreload: 8, lvContractility: 22, rvContractility: 30 },
  },
  {
    id: "hypovolemia",
    label: "Case 2: Hypovolemia",
    question: "Why can hypovolemia make PI rise in some patients but fall in others?",
    settings: { rpm: 5400, map: 85, lvPreload: 9, rvPreload: 4, lvContractility: 18, rvContractility: 35 },
  },
  {
    id: "rv-failure",
    label: "Case 3: RV failure",
    question: "Why can the LVAD be preload-limited even when CVP is high?",
    settings: { rpm: 5400, map: 78, lvPreload: 11, rvPreload: 18, lvContractility: 20, rvContractility: 8 },
  },
  {
    id: "recovery",
    label: "Case 4: LV recovery",
    question: "Why can mean pump flow fall or plateau despite better native LV function and higher pulsatility?",
    settings: { rpm: 5300, map: 75, lvPreload: 18, rvPreload: 8, lvContractility: 45, rvContractility: 35 },
  },
  {
    id: "ramp-optimization",
    label: "Case 5: Ramp optimization",
    question: "Where would you stop the ramp, and what tradeoffs are you balancing?",
    settings: { rpm: 5000, map: 82, lvPreload: 24, rvPreload: 14, lvContractility: 20, rvContractility: 25 },
  },
];

const LESSON_PRESETS = [
  {
    id: 1,
    title: "Speed shifts the HQ curve",
    subtitle: "Increasing RPM shifts the pump curve upward and to the right.",
    body: "At the same pressure head, a higher RPM lets the LVAD generate more flow. Decreasing RPM shifts the curve downward and to the left, reducing available flow for a given head pressure.",
    steps: [
      "Start at the baseline RPM and watch the active HQ curve.",
      "Increase RPM one step and notice that the curve shifts upward/right.",
      "Decrease RPM and notice the opposite shift downward/left.",
    ],
    settings: { rpm: 5300, map: 82, lvPreload: 18, rvPreload: 12, lvContractility: 25, rvContractility: 25, aorticInsufficiency: 0, inflowObstruction: 0 },
  },
  {
    id: 2,
    title: "Afterload moves the operating point",
    subtitle: "Higher MAP raises head pressure and usually lowers flow.",
    body: "For a fixed RPM, increasing MAP increases the pressure gradient across the pump. The pump does not jump to a new curve; the operating point moves along the same curve toward lower flow and higher head.",
    steps: [
      "Keep RPM fixed.",
      "Raise MAP and watch the dot move toward higher head and lower flow.",
      "Lower MAP and watch the dot move toward lower head and higher flow.",
    ],
    settings: { rpm: 5400, map: 95, lvPreload: 16, rvPreload: 10, lvContractility: 22, rvContractility: 30, aorticInsufficiency: 0, inflowObstruction: 0 },
  },
  {
    id: 3,
    title: "Preload supply limits pump flow",
    subtitle: "The pump can only move the blood delivered to it.",
    body: "Low LV filling pressure can prevent the pump from reaching the theoretical high-flow portion of the HQ curve. In this state, the patient-side preload cap matters as much as pump speed.",
    steps: [
      "Start with a low PCWP/LVEDP state.",
      "Increase RPM and notice that flow may not rise as much as expected.",
      "Give volume or increase LV filling and observe how the operating range changes.",
    ],
    settings: { rpm: 5400, map: 82, lvPreload: 8, rvPreload: 5, lvContractility: 18, rvContractility: 35, aorticInsufficiency: 0, inflowObstruction: 0 },
  },
  {
    id: 4,
    title: "RV failure creates preload limitation",
    subtitle: "High CVP does not always mean adequate LVAD preload.",
    body: "When RV function is poor, CVP can be high while LV filling remains inadequate. The LVAD may still be preload-limited because the right heart cannot deliver enough flow through the lungs to the left side.",
    steps: [
      "Start with high CVP and lower PCWP/LVEDP.",
      "Observe the CVP:PCWP mismatch.",
      "Improve RV contractility and watch whether LV filling and pump flow recover.",
    ],
    settings: { rpm: 5400, map: 78, lvPreload: 11, rvPreload: 18, lvContractility: 20, rvContractility: 8, aorticInsufficiency: 0, inflowObstruction: 0 },
  },
  {
    id: 5,
    title: "Native LV recovery changes pulsatility",
    subtitle: "Better LV function can increase pulsatility without always increasing mean pump flow.",
    body: "As native LV function improves, the aortic valve may open more often and systolic pump head may fall. This can increase pulsatility while mean pump flow plateaus or even falls depending on loading conditions.",
    steps: [
      "Start with partial LV recovery.",
      "Increase LV contractility and watch AV opening and PI.",
      "Compare mean pump flow against effective pulsatility.",
    ],
    settings: { rpm: 5300, map: 75, lvPreload: 18, rvPreload: 8, lvContractility: 42, rvContractility: 35, aorticInsufficiency: 0, inflowObstruction: 0 },
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const format = (n, digits = 1) => Number(n).toFixed(digits);

function getCurveParams(rpm) {
  if (CURVE_FITS[rpm]) return CURVE_FITS[rpm];
  const sortedRpms = Object.keys(CURVE_FITS).map(Number).sort((a, b) => a - b);
  if (rpm <= sortedRpms[0]) return CURVE_FITS[sortedRpms[0]];
  if (rpm >= sortedRpms[sortedRpms.length - 1]) return CURVE_FITS[sortedRpms[sortedRpms.length - 1]];
  for (let index = 1; index < sortedRpms.length; index += 1) {
    const lowRpm = sortedRpms[index - 1];
    const highRpm = sortedRpms[index];
    if (rpm <= highRpm) {
      const low = CURVE_FITS[lowRpm];
      const high = CURVE_FITS[highRpm];
      const t = (rpm - lowRpm) / (highRpm - lowRpm);
      return {
        h0: lerp(low.h0, high.h0, t),
        q0: lerp(low.q0, high.q0, t),
        exponent: lerp(low.exponent, high.exponent, t),
        label: `${rpm} RPM`,
      };
    }
  }
  return CURVE_FITS[5500];
}

function MiniIcon({ type = "dot", className = "h-4 w-4 text-slate-600" }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (type === "activity") return <svg {...common}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>;
  if (type === "droplet") return <svg {...common}><path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z" /></svg>;
  if (type === "gauge") return <svg {...common}><path d="M4 14a8 8 0 1 1 16 0" /><path d="M12 14l4-4" /><path d="M8 18h8" /></svg>;
  if (type === "heart") return <svg {...common}><path d="M20.8 5.6a5.4 5.4 0 0 0-7.6 0L12 6.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" /><path d="M3 12h4l2-3 3 6 2-3h3" /></svg>;
  if (type === "info") return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7h.01" /></svg>;
  if (type === "reset") return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /></svg>;
  if (type === "waves") return <svg {...common}><path d="M3 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" /><path d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" /><path d="M3 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="4" /></svg>;
}

function SliderControl({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
  unit,
  iconType,
  helper,
  compact = false,
  alertTone = "normal",
  alertNote = "",
}) {
  const numericValue = Number(value);
  const alertStyles = {
    normal: "bg-slate-100 text-slate-900 border-transparent",
    yellow: "bg-yellow-50 text-yellow-800 border-yellow-200",
    orange: "bg-orange-50 text-orange-800 border-orange-200",
    red: "bg-rose-50 text-rose-800 border-rose-200",
  };
  return (
    <div className={`${compact ? "space-y-1 rounded-xl p-2" : "space-y-2 rounded-2xl p-4"} border bg-white/70 shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-2">
          <MiniIcon type={iconType} className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
          <div className="min-w-0">
            <div className={`${compact ? "text-xs" : "text-sm"} font-semibold text-slate-900`}>{label}</div>
            {helper && !compact ? <div className="mt-0.5 text-xs leading-snug text-slate-500">{helper}</div> : null}
          </div>
        </div>
        <div
          className={`shrink-0 rounded-xl border px-2 py-1 text-right ${compact ? "text-xs" : "text-sm"} font-semibold tabular-nums ${alertStyles[alertTone] || alertStyles.normal}`}
        >
          <div>{value}{unit ? ` ${unit}` : ""}</div>
          {alertNote ? <div className="mt-0.5 text-[10px] font-bold leading-none tracking-normal">{alertNote}</div> : null}
        </div>
      </div>
      <Slider value={[numericValue]} min={min} max={max} step={step} onValueChange={(v) => setValue(v[0])} />
      {compact ? null : <div className="flex justify-between text-[11px] text-slate-400"><span>{min}</span><span>{max}</span></div>}
    </div>
  );
}

function ControllerStatCard({ title, value, unit, sub, hidden = false, onToggleHidden = null }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-black p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</div>
        {onToggleHidden ? <button type="button" onClick={onToggleHidden} className="rounded-lg border border-slate-600 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-slate-800">{hidden ? "show" : "hide"}</button> : null}
      </div>
      <div className="mt-1 flex items-baseline gap-1 font-mono">
        <span className={`text-3xl font-black tabular-nums text-white ${hidden ? "blur-sm select-none" : ""}`}>{hidden ? "--" : value}</span>
        {unit ? <span className="text-sm font-semibold text-slate-300">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 font-mono text-xs leading-snug text-slate-400">{sub}</div> : null}
    </div>
  );
}

function RpmCard({ rpm, onDecrease, onIncrease, showAllCurves, onToggleShowAllCurves }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-black p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">RPM</div>
        <button type="button" onClick={onToggleShowAllCurves} className="rounded-lg border border-slate-600 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-slate-800">{showAllCurves ? "nearby" : "all"}</button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Button onClick={onDecrease} className="h-9 w-9 rounded-xl border-slate-600 bg-slate-950 p-0 font-mono text-white hover:bg-slate-800">↓</Button>
        <div className="font-mono"><span className="text-3xl font-black tabular-nums text-white">{rpm}</span></div>
        <Button onClick={onIncrease} className="h-9 w-9 rounded-xl border-slate-600 bg-slate-950 p-0 font-mono text-white hover:bg-slate-800">↑</Button>
      </div>
      <div className="mt-1 font-mono text-xs leading-snug text-slate-400">Fitted curve selection</div>
    </div>
  );
}

function MiniFrankStarlingCurve({ preload, contractility, kind = "LV" }) {
  const width = 96;
  const height = 54;
  const pad = 6;
  const xMax = 35;
  const contractilityFraction = clamp(contractility / 50, 0, 1);
  const curveMax = kind === "RV" ? 0.15 + 0.85 * contractilityFraction : 0.12 + 0.88 * contractilityFraction;
  const curveSlope = kind === "RV" ? 0.10 + 0.24 * contractilityFraction : 0.12 + 0.28 * contractilityFraction;
  const curveMidpoint = kind === "RV" ? 9 + 5 * (1 - contractilityFraction) : 12 + 4 * (1 - contractilityFraction);
  const x = (value) => pad + (clamp(value, 0, xMax) / xMax) * (width - 2 * pad);
  const y = (value) => height - pad - clamp(value, 0, 1) * (height - 2 * pad);
  const responseForPreload = (value) => curveMax / (1 + Math.exp(-curveSlope * (value - curveMidpoint)));
  const points = Array.from({ length: 48 }, (_, index) => {
    const p = (index / 47) * xMax;
    return { p, response: responseForPreload(p) };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${x(point.p).toFixed(1)} ${y(point.response).toFixed(1)}`).join(" ");
  const dotX = x(preload);
  const dotY = y(responseForPreload(preload));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full">
      <rect x="0" y="0" width={width} height={height} rx="10" fill="#f8fafc" />
      <path d={path} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={dotX} x2={dotX} y1={dotY} y2={height - pad} stroke="#64748b" strokeDasharray="3 3" />
      <circle cx={dotX} cy={dotY} r="4" fill="#0f172a" />
    </svg>
  );
}


function AvOpenMiniCard({ avOpeningFraction, hMin }) {
  const effectiveAvOpeningFraction = hMin <= 1 ? Math.max(avOpeningFraction, 0.15) : avOpeningFraction;
  let display = "Closed";
  let sub = "No AV opening";
  if (effectiveAvOpeningFraction >= 0.85) { display = "1/1"; sub = "Opens every beat"; }
  else if (effectiveAvOpeningFraction >= 0.55) { display = "1/2"; sub = "Opens every 2 beats"; }
  else if (effectiveAvOpeningFraction >= 0.35) { display = "1/3"; sub = "Opens every 3 beats"; }
  else if (effectiveAvOpeningFraction >= 0.15) { display = "1/4"; sub = "Opens every 4 beats"; }
  return (
    <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div><div className="text-xs font-medium uppercase tracking-wide text-slate-500">AV opening</div><div className="text-xs text-slate-500">{sub}</div></div>
        <div className="text-2xl font-bold tabular-nums text-slate-950">{display}</div>
      </div>
    </div>
  );
}


function QuizMapCard({ map, revealed = true, onReveal = null }) {
  let status = "Normal MAP";
  let subtext = "Reasonable afterload range";
  let detail = "Mean arterial pressure is in a typical LVAD target range.";
  let cardClasses = "border-slate-200 bg-white";
  let textClasses = "text-slate-800";
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (map >= 100) {
    status = "Hypertensive";
    subtext = "High afterload";
    detail = "Higher MAP increases pump head pressure and can reduce LVAD flow at a fixed speed.";
    cardClasses = "border-rose-300 bg-rose-50";
    textClasses = "text-rose-800";
    badgeClasses = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (map >= 90) {
    status = "Elevated MAP";
    subtext = "Afterload-sensitive range";
    detail = "MAP is elevated enough that the operating point may move toward higher head and lower flow.";
    cardClasses = "border-orange-300 bg-orange-50";
    textClasses = "text-orange-800";
    badgeClasses = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (map < 65) {
    status = "Low MAP";
    subtext = "Possible low afterload / hypotension";
    detail = "Low MAP reduces pump head and can increase displayed flow, but may represent poor perfusion clinically.";
    cardClasses = "border-amber-200 bg-amber-50";
    textClasses = "text-amber-800";
    badgeClasses = "bg-amber-100 text-amber-800 border-amber-200";
  }

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="flex min-h-[180px] w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Blood Pressure</div>
          <div className="mt-3 text-lg font-black text-slate-950">Check MAP</div>
          <div className="mt-2 max-w-xs text-xs leading-5 text-slate-500">Click to reveal mean arterial pressure and the afterload state.</div>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700">Reveal</div>
      </button>
    );
  }

  return (
    <div className={`min-h-[180px] rounded-3xl border p-5 shadow-sm ${cardClasses}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Blood Pressure</div>
          <div className="mt-3 text-5xl leading-none">🩺</div>
        </div>
        <div className="max-w-xs text-right">
          <div className={`text-lg font-black ${textClasses}`}>{status}</div>
          <div className="mt-1 text-sm font-semibold text-slate-700">{subtext}</div>
          <div className="mt-2 text-xs leading-5 text-slate-600">{detail}</div>
          <div className={`mt-3 inline-flex rounded-xl border px-2 py-1 font-mono text-xs font-bold ${badgeClasses}`}>
            MAP {format(map, 0)} mmHg
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizPulmonaryExamCard({ pcwp, revealed = true, onReveal = null }) {
  let status = "Lungs clear";
  let subtext = "Optimized LVAD filling pressures";
  let detail = "No crackles or pulmonary congestion on exam.";
  let emoji = "🫁";
  let cardClasses = "border-slate-200 bg-white";
  let textClasses = "text-slate-800";
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (pcwp >= 24) {
    status = "Diffuse crackles";
    subtext = "Orthopnea / pulmonary edema pattern";
    detail = "Markedly elevated left-sided filling pressure with a wet-lung exam.";
    emoji = "🫁💧💧";
    cardClasses = "border-rose-300 bg-rose-50";
    textClasses = "text-rose-800";
    badgeClasses = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (pcwp >= 18) {
    status = "Bibasal crackles";
    subtext = "Shortness of breath";
    detail = "Elevated left-sided filling pressure; this is where things start to fall off the wagon.";
    emoji = "🫁💧";
    cardClasses = "border-orange-300 bg-orange-50";
    textClasses = "text-orange-800";
    badgeClasses = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (pcwp >= 12) {
    status = "Lungs mostly clear";
    subtext = "Near upper target filling range";
    detail = "Still generally optimized for an LVAD patient, but closer to the congestion threshold.";
    emoji = "🫁";
    cardClasses = "border-amber-200 bg-amber-50";
    textClasses = "text-amber-800";
    badgeClasses = "bg-amber-100 text-amber-800 border-amber-200";
  }

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="flex min-h-[180px] w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Pulmonary Exam</div>
          <div className="mt-3 text-lg font-black text-slate-950">Examine lungs</div>
          <div className="mt-2 max-w-xs text-xs leading-5 text-slate-500">Click to reveal whether the patient has crackles, pulmonary congestion, or clear lungs.</div>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700">Reveal</div>
      </button>
    );
  }

  return (
    <div className={`min-h-[180px] rounded-3xl border p-5 shadow-sm ${cardClasses}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Pulmonary Exam</div>
          <div className="mt-3 text-5xl leading-none">{emoji}</div>
        </div>
        <div className="max-w-xs text-right">
          <div className={`text-lg font-black ${textClasses}`}>{status}</div>
          <div className="mt-1 text-sm font-semibold text-slate-700">{subtext}</div>
          <div className="mt-2 text-xs leading-5 text-slate-600">{detail}</div>
          <div className={`mt-3 inline-flex rounded-xl border px-2 py-1 font-mono text-xs font-bold ${badgeClasses}`}>
            PCWP/LVEDP {format(pcwp, 1)} mmHg
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizPeripheralExamCard({ cvp, revealed = true, onReveal = null }) {
  let status = "Flat JVP";
  let subtext = "No peripheral congestion";
  let detail = "Neck veins are flat and there is no visible leg swelling.";
  let edema = "No edema";
  let imageSrc = "/jvp-flat-to5.png";
  let cardClasses = "border-slate-200 bg-white";
  let textClasses = "text-slate-800";
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (cvp >= 18) {
    status = "Severely elevated JVP";
    subtext = "Marked systemic venous congestion";
    detail = "Severe neck-vein distension with very edematous legs.";
    edema = "Severe pitting edema";
    imageSrc = "/jvp-18-up.png";
    cardClasses = "border-rose-300 bg-rose-50";
    textClasses = "text-rose-800";
    badgeClasses = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (cvp >= 13) {
    status = "Elevated JVP";
    subtext = "Systemic venous congestion";
    detail = "JVP is clearly elevated and leg swelling may be present.";
    edema = "Moderate edema";
    imageSrc = "/jvp-13-17.png";
    cardClasses = "border-orange-300 bg-orange-50";
    textClasses = "text-orange-800";
    badgeClasses = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (cvp >= 5) {
    status = "Mildly elevated JVP";
    subtext = "Mild right-sided filling pressure";
    detail = "JVP is visible low in the neck without major peripheral congestion.";
    edema = cvp >= 10 ? "Trace edema" : "No edema";
    imageSrc = "/jvp-5-to-12.png";
    cardClasses = "border-amber-200 bg-amber-50";
    textClasses = "text-amber-800";
    badgeClasses = "bg-amber-100 text-amber-800 border-amber-200";
  }

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="flex min-h-[180px] w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Peripheral Exam</div>
          <div className="mt-3 text-lg font-black text-slate-950">Examine JVP</div>
          <div className="mt-2 max-w-xs text-xs leading-5 text-slate-500">Click to reveal the neck-vein exam and peripheral edema pattern.</div>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700">Reveal</div>
      </button>
    );
  }

  return (
    <div className={`min-h-[180px] rounded-3xl border p-5 shadow-sm ${cardClasses}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Peripheral Exam</div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm">
            <img src={imageSrc} alt={`${status} illustration`} className="h-32 w-32 object-cover md:h-36 md:w-36" />
          </div>
        </div>
        <div className="max-w-xs md:text-right">
          <div className={`text-lg font-black ${textClasses}`}>{status}</div>
          <div className="mt-1 text-sm font-semibold text-slate-700">{subtext}</div>
          <div className="mt-2 text-xs leading-5 text-slate-600">{detail}</div>
          <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
            <div className={`inline-flex rounded-xl border px-2 py-1 font-mono text-xs font-bold ${badgeClasses}`}>
              CVP {format(cvp, 1)} mmHg
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">
              {edema}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LvPressureWaveformCard({ model, map, pcwp }) {
  const width = 720;
  const height = 210;
  const margin = { top: 22, right: 26, bottom: 34, left: 54 };
  const yMin = 0;
  const yMax = 140;
  const flowMin = 0;
  const flowMax = FLOW_AXIS_MAX;
  const cycleCount = 3;
  const singleCycleDurationSeconds = 1.05;
  const waveformDurationSeconds = cycleCount * singleCycleDurationSeconds;
  const xScale = (t) => margin.left + (t / cycleCount) * (width - margin.left - margin.right);
  const yScale = (pressure) => margin.top + ((yMax - pressure) / (yMax - yMin)) * (height - margin.top - margin.bottom);
  const flowYScale = (flow) => margin.top + ((flowMax - flow) / (flowMax - flowMin)) * (height - margin.top - margin.bottom);

  const smoothStep = (edge0, edge1, value) => {
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const lvPressureAt = (t) => {
    const phase = t % 1;

    // Rounded LV systolic dome. The pressure now rises quickly, peaks smoothly,
    // then falls without the broad flat plateau that made the first pass look clipped.
    const upstroke = smoothStep(0.08, 0.24, phase);
    const relaxation = 1 - smoothStep(0.42, 0.64, phase);
    const dome = 1 - 0.13 * Math.pow((phase - 0.34) / 0.22, 2);
    const systolicEnvelope = clamp(upstroke * relaxation * dome, 0, 1);

    // Small early-diastolic dip and late-diastolic atrial kick make the tracing feel less triangular.
    const earlyDiastolicDip = -2.0 * Math.exp(-Math.pow((phase - 0.70) / 0.10, 2));
    const atrialKick = 2.5 * Math.exp(-Math.pow((phase - 0.95) / 0.055, 2));

    // Let the LV curve approach MAP during valve opening, but avoid a hard clamp/flat top.
    const systolicTarget =
      model.avOpeningFraction > 0
        ? Math.min(Math.max(model.lvSystolicPressure, map + 8), map + 28)
        : model.lvSystolicPressure;
    const rawPressure = pcwp + systolicEnvelope * (systolicTarget - pcwp) + earlyDiastolicDip + atrialKick;
    return clamp(rawPressure, 0, yMax);
  };

  const aorticPressureAt = (t) => {
    const phase = t % 1;
    const avOpenAmount = clamp(model.avOpeningFraction, 0, 1);

    // Valve-event timing for the toy Wiggers diagram.
    // AV opening begins once LV pressure should exceed aortic end-diastolic pressure.
    // AV closure occurs near the end of LV systole, followed by smooth diastolic runoff.
    const avOpenStart = 0.22;
    const avClose = 0.48;
    const nextAvOpenStart = 1.22;

    const pulsePressure = 6 + 28 * avOpenAmount;
    const aorticDiastolicPressure = clamp(map - pulsePressure * 0.35, 45, 115);
    const aorticSystolicPressure = clamp(map + pulsePressure * 0.65, 55, yMax);

    const nearlyFlatClosedValvePressure = map + 1.2 * Math.sin(2 * Math.PI * phase - Math.PI / 6);

    if (avOpenAmount < 0.05) {
      return clamp(nearlyFlatClosedValvePressure, 0, yMax);
    }

    // During AV-open systole, aortic pressure should essentially equal LV pressure.
    // This makes the LV and Ao waveforms intersect at valve opening and overlap during ejection.
    if (phase >= avOpenStart && phase <= avClose) {
      const ejectionProgress = clamp((phase - avOpenStart) / (avClose - avOpenStart), 0, 1);
      const lvPressure = lvPressureAt(t);
      const physiologicSystolicCap = aorticSystolicPressure - 2.5 * Math.pow(ejectionProgress, 1.7);
      return clamp(Math.min(lvPressure, physiologicSystolicCap), 0, yMax);
    }

    // After AV closure: smooth Windkessel-like exponential diastolic decay.
    if (phase > avClose) {
      const diastolicProgress = clamp((phase - avClose) / (nextAvOpenStart - avClose), 0, 1);
      const pressureAtClosure = clamp(lvPressureAt(avClose), aorticDiastolicPressure, aorticSystolicPressure);
      const runoff = aorticDiastolicPressure + (pressureAtClosure - aorticDiastolicPressure) * Math.exp(-2.15 * diastolicProgress);
      return clamp(runoff, 0, yMax);
    }

    // Late diastole before valve opening: continue the tail end of the previous beat's runoff.
    const previousClose = avClose - 1;
    const diastolicProgress = clamp((phase - previousClose) / (avOpenStart - previousClose), 0, 1);
    const previousClosurePressure = aorticSystolicPressure;
    const runoff = aorticDiastolicPressure + (previousClosurePressure - aorticDiastolicPressure) * Math.exp(-2.15 * diastolicProgress);
    return clamp(runoff, 0, yMax);
  };

  const lvadFlowAt = (t) => {
    const phase = t % 1;

    const upstroke = smoothStep(0.10, 0.24, phase);
    const relaxation = 1 - smoothStep(0.44, 0.62, phase);
    const systolicEnvelope = upstroke * relaxation;

    // This mirrors the same diastole-to-systole motion used by the HQ dot.
    // Flow is lowest near diastolic high-head conditions and rises as LV pressure rises.
    const baselineCycleFlow = model.qDiastole + systolicEnvelope * (model.qSystole - model.qDiastole);

    // During suction-like behavior, add a late-cycle drop to visually echo the snap-back behavior.
    const suctionDrop = model.suctionMotionActive ? 0.65 * Math.exp(-Math.pow((phase - 0.82) / 0.055, 2)) : 0;
    return clamp(baselineCycleFlow - suctionDrop, flowMin, flowMax);
  };

  const points = Array.from({ length: 420 }, (_, index) => {
    const t = (index / 419) * cycleCount;
    return { t, pressure: lvPressureAt(t) };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.t).toFixed(1)} ${yScale(point.pressure).toFixed(1)}`)
    .join(" ");

  const flowPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.t).toFixed(1)} ${flowYScale(lvadFlowAt(point.t)).toFixed(1)}`)
    .join(" ");

  const aorticPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.t).toFixed(1)} ${yScale(aorticPressureAt(point.t)).toFixed(1)}`)
    .join(" ");

  const gridPressures = [0, 40, 80, 120];
  const gridFlows = [0, 2, 4, 6, 8, 10];
  const cycleMarkers = [1, 2];
  const cursorPath = `M ${margin.left} ${margin.top} L ${width - margin.right} ${margin.top}`;
  const avStatus = model.avOpeningFraction > 0 ? `AV opening ${format(model.avOpeningFraction * 100, 0)}% of systole` : "AV closed / no effective opening";

  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-slate-950">LV Pressure Waveform</div>
          <div className="text-sm text-slate-500">First-pass Wiggers-style LV pressure tracing driven by PCWP/LVEDP and modeled LV systolic pressure.</div>
        </div>
        <div className="rounded-xl border bg-slate-50 px-3 py-1 text-right text-xs font-bold text-slate-600">
          {avStatus}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[210px] w-full">
        <rect x="0" y="0" width={width} height={height} rx="22" fill="#f8fafc" />
        {gridPressures.map((pressure) => (
          <g key={`lv-grid-${pressure}`}>
            <line x1={margin.left} x2={width - margin.right} y1={yScale(pressure)} y2={yScale(pressure)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={margin.left - 10} y={yScale(pressure) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">{pressure}</text>
          </g>
        ))}
        {gridFlows.map((flow) => (
          <g key={`flow-grid-${flow}`}>
            <text x={width - margin.right + 10} y={flowYScale(flow) + 4} textAnchor="start" className="fill-sky-500 text-[11px] font-semibold">{flow}</text>
          </g>
        ))}
        {cycleMarkers.map((cycle) => (
          <g key={`cycle-marker-${cycle}`}>
            <line x1={xScale(cycle)} x2={xScale(cycle)} y1={margin.top} y2={height - margin.bottom} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 6" />
            <text x={xScale(cycle) + 5} y={height - margin.bottom - 8} className="fill-slate-400 text-[10px] font-semibold">cycle {cycle + 1}</text>
          </g>
        ))}
        <line x1={margin.left} x2={width - margin.right} y1={yScale(pcwp)} y2={yScale(pcwp)} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.85" />
        <text x={width - margin.right - 4} y={yScale(pcwp) - 6} textAnchor="end" className="fill-orange-700 text-[11px] font-bold">PCWP/LVEDP {format(pcwp, 1)}</text>
        <line x1={margin.left} x2={width - margin.right} y1={yScale(map)} y2={yScale(map)} stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.75" />
        <text x={width - margin.right - 4} y={yScale(map) - 6} textAnchor="end" className="fill-slate-600 text-[11px] font-bold">MAP {format(map, 0)}</text>
        <path d={aorticPath} fill="none" stroke="#be123c" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.88" />
        <path d={path} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={flowPath} fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <line y1={margin.top} y2={height - margin.bottom} stroke="#0f172a" strokeWidth="1.5" opacity="0.18">
          <animateMotion dur={`${waveformDurationSeconds}s`} repeatCount="indefinite" path={cursorPath} />
        </line>
        <circle r="4.5" fill="#be123c">
          <animateMotion dur={`${waveformDurationSeconds}s`} repeatCount="indefinite" path={aorticPath} />
        </circle>
        <circle r="4.5" fill="#0f172a">
          <animateMotion dur={`${waveformDurationSeconds}s`} repeatCount="indefinite" path={path} />
        </circle>
        <circle r="4.5" fill="#0284c7">
          <animateMotion dur={`${waveformDurationSeconds}s`} repeatCount="indefinite" path={flowPath} />
        </circle>
        <line x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} stroke="#334155" strokeWidth="1.25" />
        <line x1={margin.left} x2={margin.left} y1={margin.top} y2={height - margin.bottom} stroke="#334155" strokeWidth="1.25" />
        <line x1={width - margin.right} x2={width - margin.right} y1={margin.top} y2={height - margin.bottom} stroke="#0284c7" strokeWidth="1.25" />
        <text x={width / 2} y={height - 10} textAnchor="middle" className="fill-slate-600 text-[12px] font-semibold">Time across three cardiac cycles, synced to HQ-dot cycle timing</text>
        <text transform={`translate(18 ${height / 2}) rotate(-90)`} textAnchor="middle" className="fill-slate-600 text-[12px] font-semibold">LV pressure (mmHg)</text>
        <text transform={`translate(${width - 6} ${height / 2}) rotate(90)`} textAnchor="middle" className="fill-sky-600 text-[12px] font-semibold">LVAD flow (L/min)</text>
        <g>
          <rect x={margin.left + 10} y={margin.top + 8} width="252" height="28" rx="10" fill="white" opacity="0.82" />
          <line x1={margin.left + 24} x2={margin.left + 46} y1={margin.top + 23} y2={margin.top + 23} stroke="#0f172a" strokeWidth="3" />
          <text x={margin.left + 52} y={margin.top + 27} className="fill-slate-700 text-[11px] font-bold">LV</text>
          <line x1={margin.left + 86} x2={margin.left + 108} y1={margin.top + 23} y2={margin.top + 23} stroke="#be123c" strokeWidth="3" />
          <text x={margin.left + 114} y={margin.top + 27} className="fill-rose-700 text-[11px] font-bold">Ao</text>
          <line x1={margin.left + 154} x2={margin.left + 176} y1={margin.top + 23} y2={margin.top + 23} stroke="#0284c7" strokeWidth="3" />
          <text x={margin.left + 182} y={margin.top + 27} className="fill-sky-700 text-[11px] font-bold">LVAD flow</text>
        </g>
      </svg>
      <div className="mt-2 grid gap-2 text-xs text-slate-600 md:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-2"><span className="font-bold text-slate-800">Diastolic floor:</span> PCWP/LVEDP {format(pcwp, 1)} mmHg</div>
        <div className="rounded-xl bg-slate-50 p-2"><span className="font-bold text-slate-800">Systolic peak:</span> LVSP {format(model.lvSystolicPressure, 1)} mmHg</div>
        <div className="rounded-xl bg-slate-50 p-2"><span className="font-bold text-slate-800">Ao trace:</span> {model.avOpeningFraction > 0 ? "pulsatile with AV opening" : "nearly flat when AV closed"}</div>
        <div className="rounded-xl bg-slate-50 p-2"><span className="font-bold text-slate-800">Flow trace:</span> Qd {format(model.qDiastole, 2)} → Qs {format(model.qSystole, 2)} L/min</div>
      </div>
    </div>
  );
}

function buildHQCurve({ rpm, obstruction }) {
  const points = [];
  const obstructionPenalty = obstruction / 100;
  const params = getCurveParams(rpm);
  const h0 = params.h0 - 8 * obstructionPenalty;
  const q0 = clamp(params.q0 - 0.9 * obstructionPenalty, 5.8, 8.6);
  const exponent = params.exponent;
  for (let i = 0; i < CURVE_POINTS; i += 1) {
    const t = i / (CURVE_POINTS - 1);
    const q = q0 * t;
    const h = h0 * (1 - Math.pow(t, exponent));
    points.push({ q, h: clamp(h, 0, GRAPH_Y_MAX) });
  }
  return points;
}

function interpolateHeadForFlow(curve, q) {
  if (!Array.isArray(curve) || curve.length === 0) return 0;
  if (q <= curve[0].q) return curve[0].h;
  if (q >= curve[curve.length - 1].q) return curve[curve.length - 1].h;
  for (let i = 1; i < curve.length; i += 1) {
    if (curve[i].q >= q) {
      const a = curve[i - 1];
      const b = curve[i];
      const t = (q - a.q) / (b.q - a.q);
      return lerp(a.h, b.h, t);
    }
  }
  return curve[curve.length - 1].h;
}

function nearestFlowForHead(curve, targetHead) {
  if (!Array.isArray(curve) || curve.length === 0) return 0;
  let best = curve[0];
  let bestDiff = Math.abs(curve[0].h - targetHead);
  for (const point of curve) {
    const diff = Math.abs(point.h - targetHead);
    if (diff < bestDiff) { best = point; bestDiff = diff; }
  }
  return best.q;
}

function computeToyModel({ rpm, map, lvPreload, rvPreload, lvContractility, aorticInsufficiency, inflowObstruction, preloadLimitEnabled }) {
  const curve = buildHQCurve({ rpm, obstruction: inflowObstruction });
  const obstructionHeadPenalty = 0.06 * inflowObstruction;
  const contractilityFraction = lvContractility / 50;
  const frankStarlingFactor = clamp((lvPreload - 5) / 15, 0, 1);
  const mapAvThreshold = 15 + (map - 75) / 3;
  const rpmUnloadingPenalty = (rpm - 5300) / 200;
  const preloadRecruitmentBonus = clamp((lvPreload - 12) / 6, 0, 2);
  const avOpeningThreshold = clamp(mapAvThreshold + rpmUnloadingPenalty - preloadRecruitmentBonus, 8, 30);
  const fullAvOpeningThreshold = avOpeningThreshold + 20;
  const preOpeningFraction = clamp(lvContractility / avOpeningThreshold, 0, 1);
  const baseAvOpeningFraction = clamp((lvContractility - avOpeningThreshold) / (fullAvOpeningThreshold - avOpeningThreshold), 0, 1);
  const avOpeningFraction = baseAvOpeningFraction;
  const effectiveContractility = contractilityFraction * frankStarlingFactor;
  const preOpeningPressureFraction = Math.pow(preOpeningFraction, 1.25);
  const nonOpenSystolicPressure = lvPreload + preOpeningPressureFraction * frankStarlingFactor * Math.max(map - lvPreload, 0);
  const hClosedSystoleTarget = clamp(map - nonOpenSystolicPressure + obstructionHeadPenalty, 0, GRAPH_Y_MAX);
  const lvSystolicPressure = avOpeningFraction > 0 ? map : nonOpenSystolicPressure;
  const hDiastoleTarget = clamp(map - lvPreload + obstructionHeadPenalty, 0, GRAPH_Y_MAX);
  const hSystoleTarget = avOpeningFraction > 0 ? clamp(obstructionHeadPenalty, 0, GRAPH_Y_MAX) : hClosedSystoleTarget;
  const qDiastoleIdeal = nearestFlowForHead(curve, hDiastoleTarget);
  const qClosedSystoleIdeal = nearestFlowForHead(curve, hClosedSystoleTarget);
  const qSystoleIdeal = nearestFlowForHead(curve, hSystoleTarget);
  const cvpPcwpRatio = rvPreload / Math.max(lvPreload, 1);
  const smoothStep = (edge0, edge1, value) => {
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const lowPcwpSeverity = 1 - smoothStep(8, 12, lvPreload);
  const ratioSeverity = smoothStep(0.75, 1.05, cvpPcwpRatio);
  const highCvpSeverity = smoothStep(10, 14, rvPreload);
  const notHighPcwpForRvLimit = 1 - smoothStep(18, 22, lvPreload);
  const rvLimitedSeverity = Math.max(ratioSeverity, highCvpSeverity * notHighPcwpForRvLimit);
  const lowLeftFilling = lowPcwpSeverity > 0.05;
  const rvLimitedPatternRaw = rvLimitedSeverity > 0.05;
  const optimizedFilling = lowPcwpSeverity < 0.05 && rvLimitedSeverity < 0.05 && lvPreload < 18 && rvPreload < 12 && cvpPcwpRatio < 0.8;
  const lvAdequacy = clamp((lvPreload - 5) / 8, 0, 1);
  const underfillCap = clamp(2.5 + 5.5 * lvAdequacy, 2.0, 8.5);
  const rvPenalty = clamp((cvpPcwpRatio - 0.8) / 0.7, 0, 1);
  const rvLimitedCap = clamp(8.5 * (1 - 0.45 * rvPenalty), 3.0, 8.5);
  const noCap = FLOW_AXIS_MAX;
  const lowPcwpBlendedCap = noCap * (1 - lowPcwpSeverity) + underfillCap * lowPcwpSeverity;
  const rvBlendedCap = noCap * (1 - rvLimitedSeverity) + rvLimitedCap * rvLimitedSeverity;
  const theoreticalPreloadCap = clamp(Math.min(lowPcwpBlendedCap, rvBlendedCap), 2.0, FLOW_AXIS_MAX);
  const activeCurveMaxFlow = getCurveParams(rpm).q0;
  const capBelowCurveMax = theoreticalPreloadCap < activeCurveMaxFlow - 0.05;
  const rvLimitedPattern = rvLimitedPatternRaw && capBelowCurveMax;
  const preloadLimitedRaw = capBelowCurveMax && qSystoleIdeal > theoreticalPreloadCap;
  const preloadLimited = preloadLimitEnabled && preloadLimitedRaw;
  const qDiastole = clamp(preloadLimitEnabled ? Math.min(qDiastoleIdeal, theoreticalPreloadCap) : qDiastoleIdeal, 0, FLOW_AXIS_MAX);
  const qClosedSystole = clamp(preloadLimitEnabled ? Math.min(qClosedSystoleIdeal, theoreticalPreloadCap) : qClosedSystoleIdeal, 0, FLOW_AXIS_MAX);
  const qSystole = clamp(preloadLimitEnabled ? Math.min(qSystoleIdeal, theoreticalPreloadCap) : qSystoleIdeal, 0, FLOW_AXIS_MAX);
  const hDiastole = preloadLimitEnabled && qDiastole < qDiastoleIdeal ? interpolateHeadForFlow(curve, qDiastole) : hDiastoleTarget;
  const hClosedSystole = preloadLimitEnabled && qClosedSystole < qClosedSystoleIdeal ? interpolateHeadForFlow(curve, qClosedSystole) : hClosedSystoleTarget;
  const hSystole = preloadLimitEnabled && qSystole < qSystoleIdeal ? interpolateHeadForFlow(curve, qSystole) : hSystoleTarget;
  const systolicFraction = 1 / 3;
  const diastolicFraction = 2 / 3;
  const qMeanSystole = (1 - avOpeningFraction) * qClosedSystole + avOpeningFraction * qSystole;
  const hMeanSystole = (1 - avOpeningFraction) * hClosedSystole + avOpeningFraction * hSystole;
  const pumpFlow = clamp(diastolicFraction * qDiastole + systolicFraction * qMeanSystole, 0.2, FLOW_AXIS_MAX);
  const head = clamp(diastolicFraction * hDiastole + systolicFraction * hMeanSystole, 0, GRAPH_Y_MAX);
  const powerWatts = clamp(2.3 + 0.00028 * (rpm - 4500) + 0.28 * pumpFlow + 0.003 * head + 0.01 * inflowObstruction, 2.0, 9.0);
  const flowExcursion = Math.abs(qSystole - qDiastole);
  const piRatio = flowExcursion / Math.max(pumpFlow, 0.5);
  const rawPi = piRatio * 10.0;
  const piMean = clamp(rawPi, 0.0, 20.0);
  const severePreloadLimitation = preloadLimited && theoreticalPreloadCap < 3.5;
  const severePiCollapse = preloadLimited && piMean < 1.5;
  const pressureEqualizationSuction = preloadLimited && rvPreload >= lvPreload - 1;
  const suctionMotionActive = severePreloadLimitation || severePiCollapse || pressureEqualizationSuction;
  const recircFraction = clamp((aorticInsufficiency / 100) * 0.42, 0, 0.42);
  const effectiveForwardFlow = pumpFlow * (1 - recircFraction);
  let status = "Balanced";
  let explanation = "The operating point is in a reasonable conceptual range. Try changing PCWP/LVEDP, CVP, MAP, RPM, or LV contractility to see how the dot moves along the curve.";
  if (suctionMotionActive) { status = "Severe preload limitation / suction motion"; explanation = `The model is showing suction-like motion because preload limitation is severe: Qcap is ${format(theoreticalPreloadCap, 2)} L/min, PI is ${format(piMean, 1)}, and CVP/PCWP is ${format(cvpPcwpRatio, 2)}.`; }
  else if (lvPreload < 8) { status = "Preload-limited"; explanation = "Low PCWP/LVEDP raises diastolic pump head and blunts Frank-Starling recruitment, reducing average flow and potentially changing PI."; }
  else if (aorticInsufficiency > 45) { status = "AI recirculation"; explanation = "Pump flow may look acceptable, but effective systemic flow falls because some flow recirculates through the incompetent aortic valve."; }
  else if (inflowObstruction > 45) { status = "Inflow-limited"; explanation = "Inflow obstruction changes the effective curve and can blunt cyclic flow excursion despite changes in pressure head."; }
  else if (map > 95) { status = "Afterload-sensitive"; explanation = `High MAP increases diastolic pump head and raises the EF threshold required for AV opening. Current AV-opening threshold is EF ${format(avOpeningThreshold, 0)}%.`; }
  else if (rvPreload >= lvPreload && preloadLimited) { status = "Preload-limited with possible suction"; explanation = `CVP (${format(rvPreload, 1)} mmHg) is equal to or higher than PCWP/LVEDP (${format(lvPreload, 1)} mmHg), and theoretical systolic pump flow exceeds preload-supported Qmax.`; }
  else if (rvPreload >= lvPreload) { status = "Possible suction physiology"; explanation = `CVP (${format(rvPreload, 1)} mmHg) is equal to or higher than PCWP/LVEDP (${format(lvPreload, 1)} mmHg).`; }
  else if (preloadLimited) { status = "Preload-limited without suction"; explanation = `Theoretical systolic pump flow exceeds preload-supported Qmax (${format(theoreticalPreloadCap, 2)} L/min), so flow is capped.`; }
  else if (rvLimitedPattern) { status = "RV-limited filling pattern"; explanation = `CVP is high relative to PCWP/LVEDP (CVP/PCWP ${format(cvpPcwpRatio, 2)}), which can lower preload-supported Qmax to ${format(theoreticalPreloadCap, 2)} L/min.`; }
  else if (map < 65) { status = "Low afterload"; explanation = `Low MAP reduces pump head and tends to increase flow. Current AV-opening threshold is EF ${format(avOpeningThreshold, 0)}%.`; }
  else if (lvContractility < 15) { status = "Minimal native ejection"; explanation = "LV systolic pressure rises smoothly with contractility but has not yet reached the aortic pressure needed to open the valve."; }
  else if (lvContractility < 35) { status = "Partial AV opening"; explanation = `EF is above the AV-opening threshold but below full recovery. The valve can reach near-zero systolic head, but only for ${format(avOpeningFraction * 100, 0)}% of systole.`; }
  else if (lvPreload > 26) { status = "Congested/high preload"; explanation = "Higher filling pressure lowers diastolic pump head and raises flow; Frank-Starling recruitment eventually plateaus."; }
  else if (lvContractility >= 35) { status = "AV opening/high pulsatility"; explanation = "LV systolic pressure approaches MAP, consistent with more complete aortic valve opening."; }
  return { rpm, curve, head, hDiastoleTarget, hSystoleTarget, hDiastole, hSystole, qDiastole, qSystole, pumpFlow, powerWatts, theoreticalPreloadCap, preloadLimitEnabled, preloadLimited, optimizedFilling, lowLeftFilling, lvAdequacy, cvpPcwpRatio, rvPenalty, rvLimitedPattern, severePreloadLimitation, severePiCollapse, pressureEqualizationSuction, suctionMotionActive, lvPreload, rvPreload, systolicFraction, diastolicFraction, effectiveForwardFlow, piMean, piRatio, rawPi, flowExcursion, frankStarlingFactor, effectiveContractility, lvSystolicPressure, mapAvThreshold, rpmUnloadingPenalty, preloadRecruitmentBonus, avOpeningThreshold, fullAvOpeningThreshold, preOpeningFraction, preOpeningPressureFraction, hClosedSystole, qClosedSystole, qMeanSystole, baseAvOpeningFraction, afterloadAvModifier: 1, avOpeningFraction, recircFraction, qLow: qDiastole, qHigh: qSystole, hLow: hDiastole, hHigh: hSystole, status, explanation };
}

function useToyModel(inputs) {
  return useMemo(() => computeToyModel(inputs), [inputs.rpm, inputs.map, inputs.lvPreload, inputs.rvPreload, inputs.lvContractility, inputs.aorticInsufficiency, inputs.inflowObstruction, inputs.preloadLimitEnabled]);
}

function HQGraph({ model, paused, showPreloadLimit, flipAxes, setFlipAxes, showHeadLines, setShowHeadLines, showPiLines, setShowPiLines, showAllRpmCurves }) {
  const width = 720;
  const height = 640;
  const margin = { top: 36, right: 34, bottom: 62, left: 76 };
  const flowMin = 0, flowMax = FLOW_AXIS_MAX, headMin = 0, headMax = GRAPH_Y_MAX;
  const xAxisMin = flipAxes ? headMin : flowMin;
  const xAxisMax = flipAxes ? headMax : flowMax;
  const yAxisMin = flipAxes ? flowMin : headMin;
  const yAxisMax = flipAxes ? flowMax : headMax;
  const xScale = (value) => margin.left + ((value - xAxisMin) / (xAxisMax - xAxisMin)) * (width - margin.left - margin.right);
  const yScale = (value) => margin.top + ((yAxisMax - value) / (yAxisMax - yAxisMin)) * (height - margin.top - margin.bottom);
  const px = (q, h) => xScale(flipAxes ? h : q);
  const py = (q, h) => yScale(flipAxes ? q : h);
  const pathForCurve = (curve) => curve.filter((point) => point.h >= 0 && point.q >= 0 && point.q <= FLOW_AXIS_MAX).map((point, index) => `${index === 0 ? "M" : "L"} ${px(point.q, point.h).toFixed(1)} ${py(point.q, point.h).toFixed(1)}`).join(" ");
  const pathForCurveSegment = (curve, qStart, qEnd) => {
    const start = Math.min(qStart, qEnd);
    const end = Math.max(qStart, qEnd);
    const segmentPoints = curve.filter((point) => point.q >= start && point.q <= end);
    const allPoints = [{ q: start, h: interpolateHeadForFlow(curve, start) }, ...segmentPoints, { q: end, h: interpolateHeadForFlow(curve, end) }];
    return allPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${px(point.q, point.h).toFixed(1)} ${py(point.q, point.h).toFixed(1)}`).join(" ");
  };
  const pathForDirectedCurveSegment = (curve, qStart, qEnd, includeMove = true) => {
    const start = Math.max(0, Math.min(qStart, qEnd));
    const end = Math.max(qStart, qEnd);
    const ascending = qEnd >= qStart;
    const segmentPoints = curve.filter((point) => point.q >= start && point.q <= end).sort((a, b) => ascending ? a.q - b.q : b.q - a.q);
    const allPoints = [{ q: qStart, h: interpolateHeadForFlow(curve, qStart) }, ...segmentPoints, { q: qEnd, h: interpolateHeadForFlow(curve, qEnd) }];
    return allPoints.map((point, index) => `${index === 0 && includeMove ? "M" : "L"} ${px(point.q, point.h).toFixed(1)} ${py(point.q, point.h).toFixed(1)}`).join(" ");
  };
  const cyclePath = pathForCurveSegment(model.curve, model.qLow, model.qHigh);
  const suctionQTarget = 0.08;
  const suctionPath = [pathForDirectedCurveSegment(model.curve, model.qLow, model.qHigh, true), pathForDirectedCurveSegment(model.curve, model.qHigh, model.qLow, false), pathForDirectedCurveSegment(model.curve, model.qLow, model.qHigh, false), pathForDirectedCurveSegment(model.curve, model.qHigh, model.qLow, false), pathForDirectedCurveSegment(model.curve, model.qLow, model.qHigh, false), pathForDirectedCurveSegment(model.curve, model.qHigh, model.qLow, false), pathForDirectedCurveSegment(model.curve, model.qLow, suctionQTarget, false), pathForDirectedCurveSegment(model.curve, suctionQTarget, model.qLow, false)].join(" ");
  const cyclePathId = `cycle-path-${model.rpm}-${flipAxes ? "flip" : "std"}`;
  const backgroundCurves = AVAILABLE_RPMS.filter((rpm) => showAllRpmCurves ? rpm !== model.rpm : rpm === model.rpm - 500 || rpm === model.rpm + 500).map((rpm) => ({ rpm, path: pathForCurve(buildHQCurve({ rpm, obstruction: 0 })) }));
  const flowGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const headGrid = [0, 20, 40, 60, 80, 100, 120, 140];
  const gridX = flipAxes ? headGrid : flowGrid;
  const gridY = flipAxes ? flowGrid : headGrid;
  const qMin = Math.min(model.qLow, model.qHigh), qMax = Math.max(model.qLow, model.qHigh), hMin = Math.min(model.hLow, model.hHigh), hMax = Math.max(model.hLow, model.hHigh);
  const showLowFlowAlert = qMin < 2.5;
  const showSuctionAlert = model.rvPreload >= model.lvPreload - 1;
  const qCap = model.theoreticalPreloadCap;
  const activeCurveMaxFlow = getCurveParams(model.rpm).q0;
  const showPreloadCap = showPreloadLimit && qCap < activeCurveMaxFlow - 0.05;
  const meanCurveHead = interpolateHeadForFlow(model.curve, model.pumpFlow);
  const meanX = px(model.pumpFlow, meanCurveHead), meanY = py(model.pumpFlow, meanCurveHead);
  const qMinX = px(qMin, interpolateHeadForFlow(model.curve, qMin)), qMaxX = px(qMax, interpolateHeadForFlow(model.curve, qMax));
  const qMinY = py(qMin, interpolateHeadForFlow(model.curve, qMin)), qMaxY = py(qMax, interpolateHeadForFlow(model.curve, qMax));
  const lowFlowThreshold = 2.5;
  return (
    <div className="w-full overflow-hidden rounded-3xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div><div className="text-lg font-bold text-slate-950">Active HQ Curve</div><div className="text-sm text-slate-500">{flipAxes ? "Flipped axes: x = head pressure, y = flow." : "Standard axes: x = flow, y = head pressure."}</div></div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowPiLines((value) => !value)} variant={showPiLines ? "default" : "outline"} className="rounded-2xl px-3 py-2 text-xs">{showPiLines ? "PI lines on" : "PI lines off"}</Button>
          <Button onClick={() => setShowHeadLines((value) => !value)} variant={showHeadLines ? "default" : "outline"} className="rounded-2xl px-3 py-2 text-xs">{showHeadLines ? "H lines on" : "H lines off"}</Button>
          <Button onClick={() => setFlipAxes((value) => !value)} variant="outline" className="rounded-2xl px-3 py-2 text-xs">{flipAxes ? "Standard axes" : "Flip axes"}</Button>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[640px] w-full">
        <defs><filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.25" /></filter><path id={cyclePathId} d={cyclePath} /><path id={`${cyclePathId}-suction`} d={suctionPath} /></defs>
        <rect x="0" y="0" width={width} height={height} rx="24" fill="#f8fafc" />
        {showPreloadLimit && model.preloadLimited ? <g><rect x={width - margin.right - 172} y={margin.top + 46} width="172" height="46" rx="14" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.5" /><text x={width - margin.right - 86} y={margin.top + 64} textAnchor="middle" dominantBaseline="middle" className="fill-orange-700 text-[13px] font-bold">PRELOAD LIMIT</text><text x={width - margin.right - 86} y={margin.top + 81} textAnchor="middle" dominantBaseline="middle" className="fill-orange-600 text-[10px] font-semibold">Qs &gt; Qcap</text></g> : null}
        {showLowFlowAlert ? <g><rect x={width - margin.right - 156} y={margin.top - 6} width="156" height="46" rx="14" fill="#fff1f2" stroke="#fb7185" strokeWidth="1.5" /><text x={width - margin.right - 78} y={margin.top + 12} textAnchor="middle" dominantBaseline="middle" className="fill-rose-700 text-[13px] font-bold">LOW FLOW</text><text x={width - margin.right - 78} y={margin.top + 29} textAnchor="middle" dominantBaseline="middle" className="fill-rose-600 text-[10px] font-semibold">Qmin &lt; 2.5 L/min</text></g> : null}
        {showSuctionAlert ? <g><rect x={width - margin.right - 174} y={showLowFlowAlert ? margin.top + 48 : margin.top - 6} width="174" height="46" rx="14" fill="#fefce8" stroke="#eab308" strokeWidth="1.5" /><text x={width - margin.right - 87} y={showLowFlowAlert ? margin.top + 66 : margin.top + 12} textAnchor="middle" dominantBaseline="middle" className="fill-yellow-700 text-[13px] font-bold">POSSIBLE SUCTION</text><text x={width - margin.right - 87} y={showLowFlowAlert ? margin.top + 83 : margin.top + 29} textAnchor="middle" dominantBaseline="middle" className="fill-yellow-700 text-[10px] font-semibold">CVP ≈ PCWP</text></g> : null}
        {gridY.map((gy) => <g key={`gy-${gy}`}><line x1={margin.left} x2={width - margin.right} y1={yScale(gy)} y2={yScale(gy)} stroke="#e2e8f0" strokeWidth="1" /><text x={margin.left - 12} y={yScale(gy) + 4} textAnchor="end" className="fill-slate-400 text-[12px]">{gy}</text></g>)}
        {gridX.map((gx) => <g key={`gx-${gx}`}><line x1={xScale(gx)} x2={xScale(gx)} y1={margin.top} y2={height - margin.bottom} stroke="#e2e8f0" strokeWidth="1" /><text x={xScale(gx)} y={height - margin.bottom + 24} textAnchor="middle" className="fill-slate-400 text-[12px]">{gx}</text></g>)}
        <line x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} stroke="#334155" strokeWidth="1.5" />
        <line x1={margin.left} x2={margin.left} y1={margin.top} y2={height - margin.bottom} stroke="#334155" strokeWidth="1.5" />
        <text x={width / 2} y={height - 16} textAnchor="middle" className="fill-slate-700 text-[14px] font-semibold">{flipAxes ? "Head pressure, H (mmHg)" : "Pump flow, Q (L/min)"}</text>
        <text transform={`translate(22 ${height / 2}) rotate(-90)`} textAnchor="middle" className="fill-slate-700 text-[14px] font-semibold">{flipAxes ? "Pump flow, Q (L/min)" : "Head pressure, H (mmHg)"}</text>
        {backgroundCurves.map((curve) => <path key={`bg-curve-${curve.rpm}`} d={curve.path} fill="none" stroke="#94a3b8" strokeWidth="3" opacity="0.22" strokeLinecap="round" strokeDasharray="1 10" />)}
        <path d={pathForCurve(model.curve)} fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 12" />
        {showLowFlowAlert && !flipAxes ? <g><rect x={margin.left} y={margin.top} width={Math.max(0, xScale(lowFlowThreshold) - margin.left)} height={height - margin.top - margin.bottom} fill="#fecdd3" opacity="0.22" /><line x1={xScale(lowFlowThreshold)} x2={xScale(lowFlowThreshold)} y1={margin.top} y2={height - margin.bottom} stroke="#e11d48" strokeWidth="2" strokeDasharray="5 5" /><text x={xScale(lowFlowThreshold) + 8} y={height - margin.bottom - 24} className="fill-rose-700 text-[11px] font-bold">2.5 L/min</text></g> : null}
        {showLowFlowAlert && flipAxes ? <g><rect x={margin.left} y={yScale(lowFlowThreshold)} width={width - margin.left - margin.right} height={Math.max(0, height - margin.bottom - yScale(lowFlowThreshold))} fill="#fecdd3" opacity="0.22" /><line x1={margin.left} x2={width - margin.right} y1={yScale(lowFlowThreshold)} y2={yScale(lowFlowThreshold)} stroke="#e11d48" strokeWidth="2" strokeDasharray="5 5" /><text x={margin.left + 12} y={yScale(lowFlowThreshold) - 8} className="fill-rose-700 text-[11px] font-bold">2.5 L/min</text></g> : null}
        {showPreloadCap && !flipAxes ? <g><rect x={xScale(qCap)} y={margin.top} width={Math.max(0, width - margin.right - xScale(qCap))} height={height - margin.top - margin.bottom} fill="#fed7aa" opacity={model.preloadLimited ? "0.22" : "0.10"} /><line x1={xScale(qCap)} x2={xScale(qCap)} y1={margin.top} y2={height - margin.bottom} stroke="#f97316" strokeWidth="2" strokeDasharray="5 5" /><text x={xScale(qCap) + 8} y={margin.top + 48} className="fill-orange-700 text-[11px] font-bold">Qcap {format(qCap, 1)}</text></g> : null}
        {showPreloadCap && flipAxes ? <g><rect x={margin.left} y={margin.top} width={width - margin.left - margin.right} height={Math.max(0, yScale(qCap) - margin.top)} fill="#fed7aa" opacity={model.preloadLimited ? "0.22" : "0.10"} /><line x1={margin.left} x2={width - margin.right} y1={yScale(qCap)} y2={yScale(qCap)} stroke="#f97316" strokeWidth="2" strokeDasharray="5 5" /><text x={margin.left + 12} y={yScale(qCap) - 8} className="fill-orange-700 text-[11px] font-bold">Qcap {format(qCap, 1)}</text></g> : null}
        <line x1={meanX} x2={meanX} y1={meanY} y2={height - margin.bottom} stroke="#94a3b8" strokeDasharray="5 5" />
        <line x1={margin.left} x2={meanX} y1={meanY} y2={meanY} stroke="#94a3b8" strokeDasharray="5 5" />
        {showPiLines ? (!flipAxes ? <g><line x1={qMinX} x2={qMinX} y1={margin.top + 18} y2={height - margin.bottom} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.75" /><line x1={qMaxX} x2={qMaxX} y1={margin.top + 18} y2={height - margin.bottom} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.75" /><line x1={qMinX} x2={qMaxX} y1={margin.top + 18} y2={margin.top + 18} stroke="#0f172a" strokeWidth="2" strokeDasharray="3 5" /><text x={(qMinX + qMaxX) / 2} y={margin.top + 8} textAnchor="middle" className="fill-slate-900 text-[13px] font-bold">PI {format(model.piMean, 1)}</text><text x={qMinX} y={height - margin.bottom - 8} textAnchor="middle" className="fill-slate-600 text-[11px] font-semibold">Qmin</text><text x={qMaxX} y={height - margin.bottom - 8} textAnchor="middle" className="fill-slate-600 text-[11px] font-semibold">Qmax</text></g> : <g><line x1={margin.left} x2={width - margin.right} y1={qMinY} y2={qMinY} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.75" /><line x1={margin.left} x2={width - margin.right} y1={qMaxY} y2={qMaxY} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.75" /><line x1={margin.left + 18} x2={margin.left + 18} y1={qMaxY} y2={qMinY} stroke="#0f172a" strokeWidth="2" strokeDasharray="3 5" /><text x={margin.left + 24} y={(qMinY + qMaxY) / 2} className="fill-slate-900 text-[13px] font-bold">PI {format(model.piMean, 1)}</text></g>) : null}
        {showHeadLines && !flipAxes ? <g><line x1={margin.left} x2={width - margin.right} y1={yScale(hMin)} y2={yScale(hMin)} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.75" /><line x1={margin.left} x2={width - margin.right} y1={yScale(hMax)} y2={yScale(hMax)} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.75" /><text x={margin.left - 10} y={yScale(hMax) + 4} textAnchor="end" className="fill-slate-700 text-[11px] font-bold">{format(hMax, 0)}</text>{Math.abs(hMax - hMin) > 1 && hMin > 1 ? <text x={margin.left - 10} y={yScale(hMin) + 4} textAnchor="end" className="fill-slate-700 text-[11px] font-bold">{format(hMin, 0)}</text> : null}</g> : null}
        {paused ? <><circle cx={meanX} cy={meanY} r="4" fill="#0f172a" filter="url(#dotShadow)" /><circle cx={meanX} cy={meanY} r="8" fill="none" stroke="#0f172a" strokeWidth="1.5" opacity="0.14" /></> : <><circle cx={meanX} cy={meanY} r="4" fill="#64748b" opacity="0.35" /><circle cx={meanX} cy={meanY} r="8" fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.18" /><circle r="4" fill={model.suctionMotionActive ? "#b91c1c" : "#0f172a"} filter="url(#dotShadow)"><animateMotion dur={model.suctionMotionActive ? "4.2s" : "1.05s"} repeatCount="indefinite" keyPoints={model.suctionMotionActive ? "0;0.16;0.32;0.48;0.64;0.80;0.93;0" : "0;1;0"} keyTimes={model.suctionMotionActive ? "0;0.14;0.28;0.42;0.56;0.70;0.76;1" : "0;0.333;1"} calcMode={model.suctionMotionActive ? "linear" : "spline"} keySplines={model.suctionMotionActive ? undefined : "0.42 0 0.58 1;0.42 0 0.58 1"}><mpath href={`#${model.suctionMotionActive ? `${cyclePathId}-suction` : cyclePathId}`} /></animateMotion></circle><circle r="7.5" fill="none" stroke={model.suctionMotionActive ? "#b91c1c" : "#0f172a"} strokeWidth="1.5" opacity="0.14"><animateMotion dur={model.suctionMotionActive ? "4.2s" : "1.05s"} repeatCount="indefinite" keyPoints={model.suctionMotionActive ? "0;0.16;0.32;0.48;0.64;0.80;0.93;0" : "0;1;0"} keyTimes={model.suctionMotionActive ? "0;0.14;0.28;0.42;0.56;0.70;0.76;1" : "0;0.333;1"} calcMode={model.suctionMotionActive ? "linear" : "spline"} keySplines={model.suctionMotionActive ? undefined : "0.42 0 0.58 1;0.42 0 0.58 1"}><mpath href={`#${model.suctionMotionActive ? `${cyclePathId}-suction` : cyclePathId}`} /></animateMotion></circle></>}
        <text x={meanX + 16} y={meanY} className="fill-slate-500 text-[12px]">mean Q {format(model.pumpFlow)} L/min</text>
      </svg>
    </div>
  );
}

export default function LVADFlowLab() {
  const [rpm, setRpm] = useState(5300);
  const [map, setMap] = useState(82);
  const [lvPreload, setLvPreload] = useState(18);
  const [rvPreload, setRvPreload] = useState(12);
  const [lvContractility, setLvContractility] = useState(25);
  const [rvContractility, setRvContractility] = useState(25);
  const [aorticInsufficiency, setAorticInsufficiency] = useState(0);
  const [inflowObstruction, setInflowObstruction] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showPreloadLimit, setShowPreloadLimit] = useState(true);
  const [flipAxes, setFlipAxes] = useState(false);
  const [showHeadLines, setShowHeadLines] = useState(true);
  const [showPiLines, setShowPiLines] = useState(true);
  const [hidePiValue, setHidePiValue] = useState(false);
  const [showAllRpmCurves, setShowAllRpmCurves] = useState(false);
const [advancedPhysiologyMode, setAdvancedPhysiologyMode] = useState(false);
const [quizMode, setQuizMode] = useState(false);
const [showMapExam, setShowMapExam] = useState(false);
const [showPulmonaryExam, setShowPulmonaryExam] = useState(false);
const [showPeripheralExam, setShowPeripheralExam] = useState(false);
const [lessonMode, setLessonMode] = useState(false);
const [selectedLessonId, setSelectedLessonId] = useState(1);
const [showAssumptions, setShowAssumptions] = useState(false);
const [selectedCaseId, setSelectedCaseId] = useState("free");
const [monitorTick, setMonitorTick] = useState(0);

const rvRatioFromContractility = (contractility) => clamp(1.25 - 0.023 * contractility, 0.45, 1.25);

  const getComplianceProfile = (pcwp = lvPreload, cvp = rvPreload, lvEf = lvContractility, rvFn = rvContractility) => {
    // Compliance is intentionally nonlinear. In the normal/mid Frank-Starling range,
    // added volume should cause only modest pressure change. Stiffness accelerates
    // mainly near the flat/plateau portion of the curve.
    const nonlinearStiffness = (pressure, plateauStart, plateauFull, base, maxExtra) => {
      const t = clamp((pressure - plateauStart) / (plateauFull - plateauStart), 0, 1);
      const steepPart = Math.pow(t, 2.8);
      return base + maxExtra * steepPart;
    };

    const lvEfStiffness = clamp((30 - lvEf) / 100, 0, 0.25);
    const rvFnStiffness = clamp((30 - rvFn) / 80, 0, 0.35);

    const lvStiffness = clamp(
      nonlinearStiffness(pcwp, 18, 30, 0.65, 1.25) + lvEfStiffness,
      0.55,
      2.25
    );

    const rvStiffness = clamp(
      nonlinearStiffness(cvp, 12, 25, 0.7, 1.45) + rvFnStiffness,
      0.6,
      2.7
    );

    const lvLabel = lvStiffness > 1.55 ? "high LV stiffness" : lvStiffness > 1.05 ? "moderate LV stiffness" : "compliant LV";
    const rvLabel = rvStiffness > 1.65 ? "high RV stiffness" : rvStiffness > 1.1 ? "moderate RV stiffness" : "compliant RV";
    return { lvStiffness, rvStiffness, lvLabel, rvLabel };
  };

  const complianceProfile = getComplianceProfile();

  const syncCvpToPcwp = (nextPcwp, nextRvContractility = rvContractility, previousPcwp = lvPreload) => {
    if (advancedPhysiologyMode) {
      const pcwpDelta = nextPcwp - previousPcwp;
      const profile = getComplianceProfile(previousPcwp, rvPreload, lvContractility, nextRvContractility);
      const rvPressureCoupling = clamp((profile.rvStiffness / Math.max(profile.lvStiffness, 0.2)) * 0.65, 0.25, 1.6);
      setRvPreload((currentCvp) => clamp(currentCvp + pcwpDelta * rvPressureCoupling, 2, 35));
      return;
    }

    const nextRatio = rvRatioFromContractility(nextRvContractility);
    setRvPreload(clamp(nextPcwp * nextRatio, 2, 35));
  };

  const updatePcwp = (updater, options = { syncCvp: true }) => {
    setLvPreload((currentPcwp) => {
      const nextPcwp = typeof updater === "function" ? updater(currentPcwp) : updater;
      const clampedPcwp = clamp(nextPcwp, 2, 35);
      if (options.syncCvp) syncCvpToPcwp(clampedPcwp, rvContractility, currentPcwp);
      return clampedPcwp;
    });
  };

  const updateRvContractility = (nextContractility) => {
    const clampedContractility = clamp(nextContractility, 0, 50);
    setRvContractility(clampedContractility);
    syncCvpToPcwp(lvPreload, clampedContractility);
  };

  const applyVolumeChange = (volumeDelta) => {
    if (!advancedPhysiologyMode) {
      updatePcwp((value) => value + volumeDelta);
      return;
    }

    const profile = getComplianceProfile();
    const forwardTransfer = clamp(rvContractility / 50, 0.2, 1.0);
    const scaledVolume = volumeDelta * 0.35;
    const pcwpDelta = scaledVolume * profile.lvStiffness * forwardTransfer;
    const cvpDelta = scaledVolume * profile.rvStiffness * (1 + (1 - forwardTransfer));

    setLvPreload((value) => clamp(value + pcwpDelta, 2, 35));
    setRvPreload((value) => clamp(value + cvpDelta, 2, 35));
  };

  const volumeChallenge = () => applyVolumeChange(5);
  const diurese = () => applyVolumeChange(-5);

  const updateMapAbsolute = (nextMap) => {
    const clampedNextMap = clamp(nextMap, 55, 115);
    const mapDelta = clampedNextMap - map;
    const lvReserve = clamp(lvContractility / 35, 0, 1);
    const pcwpDelta = (mapDelta / 10) * lvReserve;
    setMap(clampedNextMap);
    if (mapDelta !== 0) updatePcwp((value) => value + pcwpDelta, { syncCvp: true });
  };

  const updateLvContractility = (nextContractility) => {
    setLvContractility((currentContractility) => {
      const threshold = 35;
      const previousExcess = Math.max(currentContractility - threshold, 0);
      const nextExcess = Math.max(nextContractility - threshold, 0);
      const excessChange = nextExcess - previousExcess;
      if (excessChange !== 0) updatePcwp((value) => value - excessChange * (10 / 15));
      return nextContractility;
    });
  };

  const decreaseRpm = () => {
    const currentIndex = AVAILABLE_RPMS.indexOf(rpm);
    const nextRpm = AVAILABLE_RPMS[Math.max(0, currentIndex - 1)];
    if (nextRpm !== rpm) {
      const rpmDrop = rpm - nextRpm;
      setRpm(nextRpm);
      updatePcwp((value) => value + rpmDrop / 100, { syncCvp: false });
    }
  };

  const increaseRpm = () => {
    const currentIndex = AVAILABLE_RPMS.indexOf(rpm);
    const nextRpm = AVAILABLE_RPMS[Math.min(AVAILABLE_RPMS.length - 1, currentIndex + 1)];
    if (nextRpm !== rpm) {
      const rpmRise = nextRpm - rpm;
      setRpm(nextRpm);
      updatePcwp((value) => value - rpmRise / 100, { syncCvp: false });
    }
  };

  useEffect(() => {
    const id = window.setInterval(() => setMonitorTick((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!quizMode) {
      setShowMapExam(false);
      setShowPulmonaryExam(false);
      setShowPeripheralExam(false);
    }
  }, [quizMode]);

  const model = useToyModel({ rpm, map, lvPreload, rvPreload, lvContractility, aorticInsufficiency, inflowObstruction, preloadLimitEnabled: showPreloadLimit });
  const suctionCyclePosition = monitorTick % 8;
  const suctionRecoveryFraction = model.suctionMotionActive ? clamp(suctionCyclePosition / 4, 0, 1) : 1;
  const suctionFlowNadir = Math.max(0.4, Math.min(model.pumpFlow, model.theoreticalPreloadCap) * 0.45);
  const suctionPowerNadir = Math.max(1.8, model.powerWatts * 0.65);
  const suctionPiPeak = Math.max(model.piMean + 3.5, 8.0);
  const displayedFlow = model.suctionMotionActive ? suctionFlowNadir + (model.pumpFlow - suctionFlowNadir) * suctionRecoveryFraction : model.pumpFlow;
  const displayedPower = model.suctionMotionActive ? suctionPowerNadir + (model.powerWatts - suctionPowerNadir) * suctionRecoveryFraction : model.powerWatts;
  const displayedPi = model.suctionMotionActive ? suctionPiPeak - (suctionPiPeak - model.piMean) * suctionRecoveryFraction : model.piMean;
  const activeCase = CASE_PRESETS.find((casePreset) => casePreset.id === selectedCaseId);
  const activeLesson = LESSON_PRESETS.find((lesson) => lesson.id === selectedLessonId) || LESSON_PRESETS[0];
  const pcwpAlertTone = lvPreload > 24 ? "red" : lvPreload > 18 ? "orange" : "normal";
  const pcwpAlertNote = lvPreload > 18 ? "shortness of breath" : "";
  const cvpAlertTone = rvPreload > 18 ? "red" : rvPreload > 15 ? "yellow" : "normal";
  const cvpAlertNote = rvPreload > 15 ? "worsening leg swelling" : "";
  const mapAlertTone = map < 60 ? "red" : map < 65 ? "yellow" : "normal";
  const mapAlertNote = map < 60 ? "dizziness" : "";

  const applyLessonPreset = (lessonId) => {
    const lesson = LESSON_PRESETS.find((item) => item.id === lessonId);
    if (!lesson) return;
    setSelectedLessonId(lessonId);
    const { settings } = lesson;
    setRpm(settings.rpm);
    setMap(settings.map);
    setLvPreload(settings.lvPreload);
    setRvPreload(settings.rvPreload);
    setLvContractility(settings.lvContractility);
    setRvContractility(settings.rvContractility);
    setAorticInsufficiency(settings.aorticInsufficiency);
    setInflowObstruction(settings.inflowObstruction);
    setSelectedCaseId("free");
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
  };

  const applyCasePreset = (caseId) => {
    setSelectedCaseId(caseId);
    const preset = CASE_PRESETS.find((casePreset) => casePreset.id === caseId);
    if (!preset) return;
    const { settings } = preset;
    setRpm(settings.rpm);
    setMap(settings.map);
    setLvPreload(settings.lvPreload);
    setRvPreload(settings.rvPreload);
    setLvContractility(settings.lvContractility);
    setRvContractility(settings.rvContractility);
    setAorticInsufficiency(0);
    setInflowObstruction(0);
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
  };

  const reset = () => {
    setRpm(5300);
    setMap(82);
    setLvPreload(18);
    setRvContractility(25);
    setRvPreload(clamp(18 * rvRatioFromContractility(25), 2, 35));
    setLvContractility(25);
    setAorticInsufficiency(0);
    setInflowObstruction(0);
    setSelectedCaseId("free");
    setSelectedLessonId(1);
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
  };

  const toggleQuizMode = () => {
    setQuizMode((value) => !value);
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2"><div className="rounded-2xl bg-slate-950 p-2 text-white"><MiniIcon type="heart" className="h-5 w-5" /></div></div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">LVAD Physiology Visualizer</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">An interactive teaching model for understanding how LVAD speed, preload, afterload, contractility, and pump head shape flow, power, pulsatility, and suction physiology.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setAdvancedPhysiologyMode((value) => !value)} variant={advancedPhysiologyMode ? "default" : "outline"} className="rounded-2xl">{advancedPhysiologyMode ? "Advanced physiology on" : "Advanced physiology off"}</Button>
            <Button onClick={toggleQuizMode} variant={quizMode ? "default" : "outline"} className="rounded-2xl">{quizMode ? "Quiz mode on" : "Quiz mode off"}</Button>
            <Button onClick={() => setLessonMode((value) => !value)} variant={lessonMode ? "default" : "outline"} className="rounded-2xl">{lessonMode ? "Lesson mode on" : "Lesson mode off"}</Button>
            <Button onClick={() => setShowPreloadLimit((value) => !value)} variant={showPreloadLimit ? "default" : "outline"} className="rounded-2xl">{showPreloadLimit ? "Preload cap on" : "Preload cap off"}</Button>
            <Button onClick={() => setPaused((value) => !value)} variant="outline" className="rounded-2xl">{paused ? "Play oscillation" : "Pause at mean flow"}</Button>
            <Button onClick={reset} variant="outline" className="rounded-2xl"><MiniIcon type="reset" className="mr-2 h-4 w-4" />Reset</Button>
            <select value={selectedCaseId} onChange={(event) => applyCasePreset(event.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm">
              <option value="free">Case selector</option>
              {CASE_PRESETS.map((casePreset) => <option key={casePreset.id} value={casePreset.id}>{casePreset.label}</option>)}
            </select>
          </div>
        </header>
        {lessonMode ? (
          <Card className="rounded-3xl border border-indigo-200 bg-indigo-50/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    <div className="text-xs font-black uppercase tracking-wide text-indigo-700">Lesson mode</div>
                    <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{activeLesson.title}</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-indigo-800">{activeLesson.subtitle}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{activeLesson.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-2xl border border-indigo-100 bg-white/80 p-1 shadow-sm">
                    {LESSON_PRESETS.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => applyLessonPreset(lesson.id)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition ${
                          selectedLessonId === lesson.id
                            ? "bg-slate-950 text-white shadow-sm"
                            : "text-slate-600 hover:bg-indigo-50"
                        }`}
                        aria-label={`Load lesson ${lesson.id}`}
                      >
                        {lesson.id}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2 text-xs text-slate-700 md:grid-cols-3">
                  {activeLesson.steps.map((step, index) => (
                    <div key={`${activeLesson.id}-${step}`} className="rounded-2xl border border-indigo-100 bg-white/80 p-3 shadow-sm">
                      <div className="font-bold text-slate-900">{index + 1}. {index === 0 ? "Start" : index === 1 ? "Adjust" : "Interpret"}</div>
                      <div className="mt-1 leading-5">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-5">
            <HQGraph model={model} paused={paused} showPreloadLimit={showPreloadLimit} flipAxes={flipAxes} setFlipAxes={setFlipAxes} showHeadLines={showHeadLines} setShowHeadLines={setShowHeadLines} showPiLines={showPiLines} setShowPiLines={setShowPiLines} showAllRpmCurves={showAllRpmCurves} />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <ControllerStatCard title="Flow" value={format(displayedFlow, 2)} unit="L/min" sub={model.suctionMotionActive ? "suction drop" : `Qd ${format(model.qDiastole, 2)} • Qs ${format(model.qSystole, 2)} L/min`} />
              <ControllerStatCard title="Power" value={format(displayedPower, 1)} unit="W" sub={model.suctionMotionActive ? "suction drop" : ""} />
              <RpmCard rpm={rpm} onDecrease={decreaseRpm} onIncrease={increaseRpm} showAllCurves={showAllRpmCurves} onToggleShowAllCurves={() => setShowAllRpmCurves((value) => !value)} />
              <ControllerStatCard title="PI" value={format(displayedPi, 1)} unit="" sub={model.suctionMotionActive ? "PI event" : "((Qmax - Qmin) / Qmean) x 10"} hidden={hidePiValue} onToggleHidden={() => setHidePiValue((value) => !value)} />
            </div>
            {quizMode ? (
              <div className="space-y-3">
                <LvPressureWaveformCard model={model} map={map} pcwp={lvPreload} />
              </div>
            ) : null}
            <Card className="rounded-3xl shadow-sm"><CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2"><MiniIcon type="info" className="h-5 w-5 text-slate-600" /><div className="text-lg font-bold">Teaching interpretation</div></div>
              <div className="flex flex-wrap items-center gap-2"><Badge className="rounded-xl px-3 py-1 text-sm">{model.status}</Badge></div>
              {activeCase ? <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">Case question</div><p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{activeCase.question}</p><p className="mt-2 text-xs leading-5 text-slate-500">Case settings loaded: RPM {rpm}, MAP {format(map, 0)} mmHg, PCWP/LVEDP {format(lvPreload, 1)} mmHg, CVP {format(rvPreload, 1)} mmHg, LV EF {format(lvContractility, 0)}%, RV contractility {format(rvContractility, 0)}%.</p></div> : <p className="mt-3 text-sm leading-6 text-slate-600">{showPreloadLimit ? model.explanation : "Preload limiting is currently turned off. The graph is showing the theoretical HQ-curve behavior from pressure-derived head alone, without patient-side flow supply constraints."}</p>}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowAssumptions((value) => !value)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left hover:bg-slate-50"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">Assumptions and Rules</div>
                    <div className="text-xs text-slate-500">Click to {showAssumptions ? "hide" : "show"} model assumptions, physiology links, and key equations.</div>
                  </div>
                  <div className="rounded-xl border bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600">
                    {showAssumptions ? "Hide" : "Show"}
                  </div>
                </button>
                {showAssumptions ? (
                  <div className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">HQ curve and head pressure</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">At fixed RPM, the operating point is selected from the fitted HQ curve. Diastolic head is approximated as MAP - PCWP/LVEDP. Lower head corresponds to higher pump flow along the curve; higher head corresponds to lower pump flow.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">H = MAP - PCWP/LVEDP</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">Mean pump flow</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">The dot cycles between diastolic and systolic operating points. Mean displayed flow is time-weighted toward diastole using a simple 2/3 diastole and 1/3 systole approximation.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">Qmean = 2/3 × Qdiastole + 1/3 × Qsystole</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">Aortic valve opening</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">The EF threshold for AV opening shifts with MAP, RPM, and preload. Higher MAP and higher RPM make AV opening harder; higher PCWP/LVEDP modestly helps opening through preload recruitment. Near-complete opening occurs about 20 EF points above the threshold.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">AV threshold ≈ MAP effect + RPM unloading - preload recruitment</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">Preload supply cap</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">When preload limiting is enabled, the patient-side supply cap can prevent the dot from reaching the theoretical high-flow portion of the HQ curve. Low PCWP/LVEDP and RV-limited filling can both lower Qcap.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">Displayed Q = min(HQ-derived Q, preload-supported Qcap)</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">Pulsatility index</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">PI is modeled from the cyclic flow excursion. Larger separation between Qmax and Qmin raises PI, while severe preload limitation or suction-like behavior can collapse or destabilize PI.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">PI ≈ ((Qmax - Qmin) / Qmean) × 10</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">Advanced physiology mode</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">Advanced mode keeps the same visualizer but links volume changes to PCWP and CVP through nonlinear LV/RV stiffness. Stiffness is intentionally mild in the mid Frank-Starling range and rises mainly near the plateau. Poor RV function raises CVP more and transfers less volume to left-sided filling.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">Current: {complianceProfile.lvLabel}; {complianceProfile.rvLabel}</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">MAP → wedge pressure</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">When MAP is changed directly, the model assumes afterload changes can secondarily shift PCWP/LVEDP. The effect is larger when LV contractile reserve is present, because a more functional LV is more sensitive to loading conditions.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">ΔPCWP = (ΔMAP / 10) × clamp(LV EF / 35, 0, 1)</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">MAP → CVP</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">In simple mode, MAP-related PCWP changes are followed by CVP through the RV contractility-derived CVP:PCWP ratio. In advanced mode, CVP changes according to the pressure change in PCWP multiplied by an RV/LV stiffness coupling factor.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">Simple: CVP = PCWP × CVP:PCWP ratio</div>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">Advanced: ΔCVP = ΔPCWP × clamp((RV stiffness / LV stiffness) × 0.65, 0.25, 1.6)</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">LV contractility → wedge pressure</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">Below an EF/contractility of about 35%, the model mainly changes AV-opening behavior. Once LV contractility rises above 35%, additional native recovery lowers PCWP/LVEDP more strongly, representing improved native LV unloading.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">If EF &gt; 35: ΔPCWP = -Δ(EF above 35) × (10 / 15)</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="font-bold text-slate-800">RV contractility → CVP:PCWP ratio</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">RV contractility controls how much right-sided pressure is required to support left-sided filling. Poor RV contractility produces a higher CVP:PCWP ratio; better RV contractility lowers the ratio.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">CVP:PCWP = clamp(1.25 - 0.023 × RV contractility, 0.45, 1.25)</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 md:col-span-2">
                        <div className="font-bold text-slate-800">RPM → wedge pressure</div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">Changing RPM secondarily changes PCWP/LVEDP in the direction expected from LV unloading. Increasing RPM lowers PCWP/LVEDP; decreasing RPM raises PCWP/LVEDP. In this version, CVP is not directly changed by RPM unless another rule or mode links the pressure change forward.</p>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">RPM increase: ΔPCWP = -ΔRPM / 100</div>
                        <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-slate-700">RPM decrease: ΔPCWP = +ΔRPM / 100</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent></Card>
          </div>
          <aside className="space-y-5">
            <div className="rounded-3xl border bg-white/80 p-3 shadow-sm">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Physiology controls</div>
              <div className="grid grid-cols-1 gap-3">
                {quizMode ? (
                  <QuizMapCard
                    map={map}
                    revealed={showMapExam}
                    onReveal={() => setShowMapExam(true)}
                  />
                ) : (
                  <SliderControl
                    compact={advancedPhysiologyMode}
                    label="MAP / afterload"
                    value={map}
                    setValue={updateMapAbsolute}
                    min={55}
                    max={115}
                    step={1}
                    unit="mmHg"
                    iconType="gauge"
                    alertTone={mapAlertTone}
                    alertNote={mapAlertNote}
                    helper="Higher MAP raises diastolic head pressure, tends to reduce flow, and modestly raises PCWP/LVEDP."
                  />
                )}
                {quizMode ? (
                  <QuizPulmonaryExamCard
                    pcwp={lvPreload}
                    revealed={showPulmonaryExam}
                    onReveal={() => setShowPulmonaryExam(true)}
                  />
                ) : (
                  <SliderControl
                    compact={advancedPhysiologyMode}
                    label="PCWP / LVEDP"
                    value={format(lvPreload, 1)}
                    setValue={updatePcwp}
                    min={2}
                    max={35}
                    step={1}
                    unit="mmHg"
                    iconType="waves"
                    alertTone={pcwpAlertTone}
                    alertNote={pcwpAlertNote}
                    helper="Approximate LV filling pressure / pump inflow pressure during diastole. CVP tracks this unless RV contractility changes."
                  />
                )}
                {quizMode ? (
                  <QuizPeripheralExamCard
                    cvp={rvPreload}
                    revealed={showPeripheralExam}
                    onReveal={() => setShowPeripheralExam(true)}
                  />
                ) : (
                  <SliderControl
                    compact={advancedPhysiologyMode}
                    label="CVP"
                    value={format(rvPreload, 1)}
                    setValue={() => {}}
                    min={2}
                    max={35}
                    step={1}
                    unit="mmHg"
                    iconType="waves"
                    alertTone={cvpAlertTone}
                    alertNote={cvpAlertNote}
                    helper={
                      advancedPhysiologyMode
                        ? `${complianceProfile.rvLabel}; CVP changes with RV stiffness and volume transfer.`
                        : `Tracks PCWP by CVP:PCWP ratio ${format(rvPreload / Math.max(lvPreload, 1), 2)}. Adjust RV contractility to change it.`
                    }
                  />
                )}
                <SliderControl compact={advancedPhysiologyMode} label="LV contractility / EF" value={lvContractility} setValue={updateLvContractility} min={0} max={50} step={1} unit="%" iconType="heart" helper={advancedPhysiologyMode ? `AV-opening threshold still applies; lower EF is treated as ${complianceProfile.lvLabel}.` : "AV-opening EF threshold shifts with MAP, RPM unloading, and PCWP/LVEDP preload recruitment."} />
                <SliderControl compact={advancedPhysiologyMode} label="RV contractility" value={rvContractility} setValue={updateRvContractility} min={0} max={50} step={1} unit="%" iconType="heart" helper={advancedPhysiologyMode ? `Lower RV function increases right-sided stiffness and blunts forward transfer to PCWP.` : "0% = poor RV contractility; 50% = maximum RV contractility. Higher RV contractility lowers CVP:PCWP."} />
                {advancedPhysiologyMode ? <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-3"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">Advanced volume/compliance</div><div className="grid grid-cols-2 gap-2"><Button onClick={volumeChallenge} variant="outline" className="rounded-xl bg-white text-xs">Give fluid</Button><Button onClick={diurese} variant="outline" className="rounded-xl bg-white text-xs">Diurese</Button></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-white p-2"><div className="font-bold text-slate-700">LV</div><div className="text-slate-500">{complianceProfile.lvLabel}</div><div className="mt-1 font-mono text-slate-700">stiffness {format(complianceProfile.lvStiffness, 2)}</div></div><div className="rounded-xl bg-white p-2"><div className="font-bold text-slate-700">RV</div><div className="text-slate-500">{complianceProfile.rvLabel}</div><div className="mt-1 font-mono text-slate-700">stiffness {format(complianceProfile.rvStiffness, 2)}</div></div></div><p className="mt-2 text-xs leading-5 text-indigo-800">Fluid now changes PCWP and CVP with different slopes. Poor RV function raises CVP more and transfers less volume to left-sided filling.</p></div> : null}
                <div className="rounded-2xl border bg-white p-3"><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Frank-Starling curves</div><div className="grid grid-cols-2 gap-3"><div><div className="mb-1 text-xs font-semibold text-slate-500">LV</div><MiniFrankStarlingCurve preload={lvPreload} contractility={lvContractility} kind="LV" /><div className="mt-1 text-xs text-slate-500">PCWP/LVEDP</div></div><div><div className="mb-1 text-xs font-semibold text-slate-500">RV</div><MiniFrankStarlingCurve preload={rvPreload} contractility={rvContractility} kind="RV" /><div className="mt-1 text-xs text-slate-500">CVP</div></div></div></div>
                <AvOpenMiniCard avOpeningFraction={model.avOpeningFraction} hMin={Math.min(model.hLow, model.hHigh)} />
              </div>
            </div>
          </aside>
        </div>
        <footer className="rounded-3xl border bg-white/70 p-4 text-xs leading-5 text-slate-500 shadow-sm">This prototype is for education only. It does not use Abbott proprietary pump equations and should not be used for patient care. HeartMate 3 displayed flow is estimated, not directly measured; clinical speed optimization requires LVAD parameters, MAP, symptoms, echo, invasive hemodynamics, and LVAD team judgment.</footer>
      </div>
      <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500"><div>Created by Dr. Rudy Unni, MD</div><div className="mt-1 inline-flex rounded-xl border bg-white px-3 py-1 text-[11px] font-medium text-slate-500">LVAD FlowLab v7.9 - case selector</div></footer>
    </div>
  );
}
