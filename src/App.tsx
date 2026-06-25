// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import PlaxEchoImageCard from "./PlaxEchoImageCard";
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
    question: "A 60-year-old man with a HeartMate 3, presents with low-flow alarms and change in his PI. Her usual flow is 5.3 L/min and PI is 5.",
    settings: { rpm: 5100, map: 100, lvPreload: 15.5, rvPreload: 8.7, lvContractility: 22, rvContractility: 30 },
    secondaryQuestions: [
      {
        question: "How does the effect of afterload on flow, change at higher LVAD speeds?",
        hint: "Watch how the operating point shifts along the higher HQ curve. Does the same increase in afterload now cause a larger or smaller reduction in flow?",
      },
      {
        question: "How does the effect of afterload on flow change when the patient becomes relatively underfilled? Set PCWP/LVEDP to 9 mmHg.",
        hint: "Observe what happens to diastolic head pressure and Qmin. Does hypertension become more dangerous when preload is low?",
      },
      {
        question: "What happens to pulsatility index (PI) as MAP rises during hypertension? Why?",
        hint: "Compare how much the dot moves during the cardiac cycle at low versus high MAP.",
      },
      {
        question: "At what MAP does the aortic valve stop opening in this patient? Now increase speed and check. Now decrease LV contractility and check.",
        hint: "Follow the AV-opening indicator while increasing afterload.",
      },
      {
        question: "Why can two patients with the same MAP have very different LVAD flows?",
        hint: "Compare the effects of changing LV contractility and PCWP while keeping MAP fixed.",
      },
      {
        question: "How does hypertension affect the systolic versus diastolic portions of the HQ-cycle differently?",
        hint: "Look carefully at Qmax versus Qmin during rising afterload.",
      },
      {
        question: "When someone has hypertension, low contractility, and low LVAD speed, what part of the HQ curve are they on: flat or steep?",
        hint: "Think about shut-off pressure and where the operating point sits relative to the flat portion of the HQ curve.",
      },
    ],
  },
  {
    id: "hypovolemia",
    label: "Case 2: Hypovolemia",
    question: "A 65-year-old woman with a HeartMate 3, presents with low-flow alarms. His MAP is 78 mmHg and his usual flow is 5.2 L/min with a PI of 6.5. He says he's been lightheaded this week and thinks he's seen PIs in the 2s and 3s.",
    settings: { rpm: 5000, map: 80, lvPreload: 9, rvPreload: 6.9, lvContractility: 22, rvContractility: 23, aorticInsufficiency: 0 },
    secondaryQuestions: [
      {
        question: "How does progressive hypovolemia change the relationship between LVAD speed and flow?",
        hint: "Reduce PCWP/LVEDP stepwise while increasing RPM. Does higher speed always improve flow once preload becomes limited?",
      },
      {
        question: "At what filling pressure do suction events first begin appearing in this patient?",
        hint: "Watch the LV cavity size, Qmin, and septal position as preload falls.",
      },
      {
        question: "Why can increasing LVAD speed worsen instability in an underfilled patient?",
        hint: "LVAD = wedge adjuster. Observe what happens to the LV cavity and inflow conditions at high RPM and low preload.",
      },
      {
        question: "How does hypovolemia affect pulsatility index (PI)?",
        hint: "Compare effect of falling preload in patients with contractile LVs vs non-contractile.",
      },
      {
        question: "What happens to native aortic valve opening as preload progressively falls?",
        hint: "Frank starling law. What happens to systolic pressure generation and thus QMax as preload drops?",
      },
      {
        question: "Why can two patients with identical LVAD speeds and MAPs have very different flows during hypovolemia?",
        hint: "Compare patients with different preload and LV contractility while holding afterload constant.",
      },
      {
        question: "How does low preload change the sensitivity of LVAD flow to afterload?",
        hint: "Set PCWP/LVEDP low, then increase MAP. Does hypertension now cause a larger drop in flow?",
      },
      {
        question: "What happens to the operating point on the HQ curve as preload falls?",
        hint: "Watch how reduced diastolic head pressure shifts the operating point during the cardiac cycle.",
      },
      {
        question: "How does reducing RPM compare with giving fluids in an underfilled patient?",
        hint: "Try both interventions separately. Which improves suction first? Which restores total flow better?",
      },
      {
        question: "At low preload, what happens to Qmax and Qmin differently?",
        hint: "Look carefully at systolic versus diastolic flow as the ventricle becomes smaller.",
      },
      {
        question: "Why can severe hypovolemia make the LVAD appear “afterload sensitive” even without major hypertension?",
        hint: "Observe how close the operating point moves toward shut-off pressure when preload is critically reduced.",
      },
    ],
  },
  {
    id: "hypervolemia",
    label: "Case 3: Hypervolemia / congestion",
    question: "A 62-year-old man with a HeartMate 3 presents with dyspnea. ",
    settings: { rpm: 5000, map: 86, lvPreload: 22, rvPreload: 17.4, lvContractility: 17, rvContractility: 24, aorticInsufficiency: 0 },
    secondaryQuestions: [
      {
        question: "As you increase RPM in this congested patient, what happens to PCWP/LVEDP and CVP?",
        hint: "Watch what happens to the POCUS, look at the RV. Can you just increase speed to fix congestion?",
      },
      {
        question: "In this patient, RV function is not great. How does improved RV function allow you ?",
        hint: "RV reserve is limited here. Compare how much wedge falls versus how much CVP falls.",
      },
      {
        question: "What happens if you lower speed again while still hypervolemic?",
        hint: "Observe whether reloading raises CVP and wedge in parallel when congestion persists.",
      },
      {
        question: "How does poor LV contractility (14%) affect AV opening and pulsatility in this wet state?",
        hint: "Track AV opening behavior and PI as speed and filling pressures change.",
      },
      {
        question: "At a similar MAP, why can this patient remain symptomatic despite a modest wedge reduction?",
        hint: "Assess residual CVP elevation and ongoing RV-limited physiology.",
      },
      {
        question: "What combination improves congestion most: speed adjustment alone, diuresis alone, or both?",
        hint: "Try each intervention separately, then combine them and compare PCWP, CVP, and displayed flow.",
      },
    ],
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
function computeMapFromSvr({ svr, cardiacOutput, cvp }) {
  const resistance = clamp(svr, 300, 2000);
  return cvp + (cardiacOutput * resistance) / 80;
}

function computeFickCardiacOutput({ model, pumpFlowForDisplay }) {
  const hasAi = (model.recircFraction || 0) > 0.01;
  const effectivePumpFlow = hasAi ? model.effectiveForwardFlow : pumpFlowForDisplay;
  return effectivePumpFlow + model.nativeFlow;
}

function computeSvrFromMap({ map, cvp, cardiacOutput }) {
  const co = Math.max(cardiacOutput, 0.01);
  return ((map - (cvp || 0)) * 80) / co;
}
const getAiSeverityLabel = (value) => {
  if (value >= 60) return "Severe";
  if (value >= 30) return "Moderate";
  return "None / Mild";
};

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
  note,
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
          {note ? <div className="mt-0.5 text-[10px] leading-tight text-slate-700">{note}</div> : null}
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

function HemodynamicMonitorCard({ map, model, displayedPumpFlow, showDebugPanel, onToggleDebug, cvp, pcwp, preloadMode, afterloadMode, targetSvr }) {
  const valveOpening = model.avOpeningFraction > 0.01;
  const pulsePressure = valveOpening
    ? clamp(8 + model.avOpeningFraction * 30 + model.nativeFlow * 3, 10, 55)
    : 0;
  const systolicPressure = map + (2 / 3) * pulsePressure;
  const diastolicPressure = map - (1 / 3) * pulsePressure;
  const hasAi = (model.recircFraction || 0) > 0.01;
  const fickCO = computeFickCardiacOutput({ model, pumpFlowForDisplay: displayedPumpFlow });
  const calculatedSvr = computeSvrFromMap({ map, cvp, cardiacOutput: fickCO });

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950 p-4 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Hemodynamic monitor</div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onToggleDebug} className="rounded-lg border border-slate-600 bg-slate-900/90 px-3 py-1 text-[10px] font-semibold text-slate-200 hover:bg-slate-800">
            {showDebugPanel ? "Hide debug" : "Show debug"}
          </button>
          <span className={`h-2.5 w-2.5 rounded-full ${valveOpening ? "bg-emerald-400" : "bg-sky-400"}`} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-700 bg-black/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {valveOpening ? "BP" : "MAP"}
          </div>
          <div className="mt-1 font-mono text-3xl font-black tabular-nums">
            {valveOpening
              ? `${format(systolicPressure, 0)}/${format(diastolicPressure, 0)} (${format(map, 0)})`
              : format(map, 0)}
          </div>
          <div className="mt-1 font-mono text-xs text-slate-400">
            mmHg
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-black/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Fick CO</div>
          <div className="mt-1 font-mono text-3xl font-black tabular-nums">{format(fickCO, 1)}</div>
          <div className="mt-1 font-mono text-xs text-slate-400">
            {hasAi ? `${format(model.effectiveForwardFlow, 1)} pump (forward) + ${format(model.nativeFlow, 1)} native L/min` : `${format(displayedPumpFlow, 1)} pump + ${format(model.nativeFlow, 1)} native L/min`}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-black/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">PCWP</div>
          <div className="mt-1 font-mono text-3xl font-black tabular-nums">{format(pcwp, 1)}</div>
          <div className="mt-1 font-mono text-xs text-slate-400">
            mmHg
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-black/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">CVP</div>
          <div className="mt-1 font-mono text-3xl font-black tabular-nums">{format(cvp, 1)}</div>
          <div className="mt-1 font-mono text-xs text-slate-400">
            {preloadMode === "msfp" ? "Derived from MSFP" : "Measured"}
          </div>
        </div>
      </div>
      {showDebugPanel ? (
        <div className="mt-4 rounded-2xl border border-slate-700 bg-black/40 p-3 text-xs text-slate-200">
          <div className="grid grid-cols-2 gap-2">
            <div>pumpFlow</div><div className="font-mono">{format(model.pumpFlow, 2)} L/min</div>
            <div>effectiveForwardFlow</div><div className="font-mono">{format(model.effectiveForwardFlow, 2)} L/min</div>
            <div>recircFraction</div><div className="font-mono">{format(model.recircFraction, 2)}</div>
            <div>cardiacOutput</div><div className="font-mono">{format(model.cardiacOutput, 2)} L/min</div>
            <div>SVR from MAP/CVP/Fick CO</div>
            <div className="font-mono">{format(calculatedSvr, 0)} dyn·s·cm⁻⁵</div>
            {afterloadMode === "svr" ? (
              <>
                <div>SVR target (set)</div>
                <div className="font-mono">{format(targetSvr, 0)} dyn·s·cm⁻⁵</div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
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

function QuizMapCard({ map, model, avOpeningFraction = 0, revealed = true, onReveal = null }) {
  const valveOpeningIntermittent = avOpeningFraction > 0.01;
  const pulsePressure = valveOpeningIntermittent
    ? clamp(8 + avOpeningFraction * 30 + model.nativeFlow * 3, 10, 55)
    : 0;
  const systolicPressure = map + (2 / 3) * pulsePressure;
  const diastolicPressure = map - (1 / 3) * pulsePressure;

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="flex min-h-[180px] w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:bg-slate-50"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Blood Pressure</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700">Reveal</div>
      </button>
    );
  }

  return (
    <div className="min-h-[180px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Blood Pressure</div>
      <div className="mt-3 text-5xl leading-none font-black tabular-nums text-slate-950">
        {valveOpeningIntermittent
              ? `${format(systolicPressure, 0)}/${format(diastolicPressure, 0)} (${format(map, 0)})`
          : `MAP ${format(map, 0)}`}
      </div>
      <div className="mt-2 text-sm text-slate-500">mmHg</div>
    </div>
  );
}

function QuizPulmonaryExamCard({ pcwp, revealed = true, onReveal = null }) {
  let status = "Lungs clear";
  let emoji = "🫁";
  let cardClasses = "border-slate-200 bg-white";
  let textClasses = "text-slate-800";
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (pcwp >= 24) {
    status = "Diffuse crackles";
    emoji = "🫁💧💧";
    cardClasses = "border-rose-300 bg-rose-50";
    textClasses = "text-rose-800";
    badgeClasses = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (pcwp >= 18) {
    status = "Bibasal crackles";
    emoji = "🫁💧";
    cardClasses = "border-orange-300 bg-orange-50";
    textClasses = "text-orange-800";
    badgeClasses = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (pcwp >= 12) {
    status = "Lungs mostly clear";
    emoji = "🫁";
    cardClasses = "border-slate-200 bg-white";
    textClasses = "text-slate-800";
    badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";
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
        </div>
      </div>
    </div>
  );
}

function QuizPeripheralExamCard({ cvp, revealed = true, onReveal = null }) {
  let status = "Flat JVP";
  let detail = "Neck veins are flat and there is no visible leg swelling.";
  let edema = "No edema";
  let imageSrc = "/jvp-flat-to5.png";
  let cardClasses = "border-slate-200 bg-white";
  let textClasses = "text-slate-800";
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (cvp >= 18) {
    status = "Severely elevated JVP";
    detail = "Severe neck-vein distension with very edematous legs.";
    edema = "Severe pitting edema";
    imageSrc = "/jvp-18-up.png";
    cardClasses = "border-rose-300 bg-rose-50";
    textClasses = "text-rose-800";
    badgeClasses = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (cvp >= 12) {
    status = "JVP ~15 cm H2O";
    detail = "JVP is clearly elevated and leg swelling may be present.";
    edema = "Moderate edema";
    imageSrc = "/jvp-13-17.png";
    cardClasses = "border-orange-300 bg-orange-50";
    textClasses = "text-orange-800";
    badgeClasses = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (cvp >= 5) {
    status = "JVP ~8 cm H2O";
    detail = "JVP is visible low in the neck without major peripheral congestion.";
    edema = cvp >= 10 ? "Trace edema" : "No edema";
    imageSrc = "/jvp-5-to-12.png";
    cardClasses = "border-slate-200 bg-white";
    textClasses = "text-slate-800";
    badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";
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
          <div className="mt-2 text-xs leading-5 text-slate-600">{detail}</div>
          <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
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
  // AI fraction is based on the selected percent but modified by pump speed.
  const baseAiFraction = clamp(aorticInsufficiency / 100, 0, 1);
  const rpmModifier = clamp((rpm - 4500) / 3000, -0.6, 1); // negative at low speeds, positive at high speeds
  const aiInsufficiencyFraction = clamp(baseAiFraction * (1 + 0.8 * rpmModifier), 0, 1);
  const aiPreloadBoost = clamp(aiInsufficiencyFraction * 100 * 0.03, 0, 3);
  const effectiveLvPreload = clamp(lvPreload + aiPreloadBoost, 2, 35);
  const effectiveMap = clamp(map - aorticInsufficiency * 0.16, 40, 115);

  const contractilityFraction = lvContractility / 50;
  const frankStarlingFactor = clamp((effectiveLvPreload - 5) / 15, 0, 1);
  const mapAvThreshold = 15 + (effectiveMap - 75) / 3;
  const rpmUnloadingPenalty = (rpm - 5300) / 200;
  const preloadRecruitmentBonus = clamp((effectiveLvPreload - 12) / 6, 0, 2);
  const avOpeningThreshold = clamp(mapAvThreshold + rpmUnloadingPenalty - preloadRecruitmentBonus, 8, 30);
  const fullAvOpeningThreshold = avOpeningThreshold + 20;
  const preOpeningFraction = clamp(lvContractility / avOpeningThreshold, 0, 1);
  const baseAvOpeningFraction = clamp((lvContractility - avOpeningThreshold) / (fullAvOpeningThreshold - avOpeningThreshold), 0, 1);
  const avOpeningFraction = baseAvOpeningFraction;
  const effectiveContractility = contractilityFraction * frankStarlingFactor;
  const preOpeningPressureFraction = Math.pow(preOpeningFraction, 1.25);
  const nonOpenSystolicPressure = effectiveLvPreload + preOpeningPressureFraction * frankStarlingFactor * Math.max(effectiveMap - effectiveLvPreload, 0);
  const hClosedSystoleTarget = clamp(effectiveMap - nonOpenSystolicPressure + obstructionHeadPenalty, 0, GRAPH_Y_MAX);
  const lvSystolicPressure = avOpeningFraction > 0 ? effectiveMap : nonOpenSystolicPressure;
  const hDiastoleTarget = clamp(effectiveMap - effectiveLvPreload + obstructionHeadPenalty, 0, GRAPH_Y_MAX);
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
  const recircFraction = clamp(aiInsufficiencyFraction * 0.42, 0, 0.9);
  const effectiveForwardFlow = pumpFlow * (1 - recircFraction);
  const nativeFlowPotential = 5.5 * contractilityFraction * frankStarlingFactor;
  const nativeFlow = clamp(nativeFlowPotential * avOpeningFraction * (1 - recircFraction), 0, 6.5);
  const cardiacOutput = effectiveForwardFlow + nativeFlow;
  let status = "Balanced";
  let explanation = "The operating point is in a reasonable conceptual range. Try changing PCWP/LVEDP, CVP, MAP, RPM, or LV contractility to see how the dot moves along the curve.";
  if (suctionMotionActive) { status = "Severe preload limitation / suction motion"; explanation = `The model is showing suction-like motion because preload limitation is severe: Qcap is ${format(theoreticalPreloadCap, 2)} L/min, PI is ${format(piMean, 1)}, and CVP/PCWP is ${format(cvpPcwpRatio, 2)}.`; }
  else if (lvPreload < 8) { status = "Preload-limited"; explanation = "Low PCWP/LVEDP raises diastolic pump head and blunts Frank-Starling recruitment, reducing average flow and potentially changing PI."; }
  else if (aorticInsufficiency > 45) {
    status = "AI recirculation";
    explanation = `Regurgitant flow increases LV filling and lowers effective aortic pressure. Measured pump flow may rise, but effective systemic flow is ${format(effectiveForwardFlow, 2)} L/min because some volume recirculates back across the valve. PI tends to fall.`;
  }
  else if (aorticInsufficiency > 0) {
    status = "Aortic regurgitation";
    explanation = `Mild AI raises LV preload and lowers effective aortic pressure, narrowing pump head and increasing mean pump flow while reducing pulsatility.`;
  }
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
  return { rpm, curve, head, hDiastoleTarget, hSystoleTarget, hDiastole, hSystole, qDiastole, qSystole, pumpFlow, powerWatts, theoreticalPreloadCap, preloadLimitEnabled, preloadLimited, optimizedFilling, lowLeftFilling, lvAdequacy, cvpPcwpRatio, rvPenalty, rvLimitedPattern, severePreloadLimitation, severePiCollapse, pressureEqualizationSuction, suctionMotionActive, lvPreload, rvPreload, systolicFraction, diastolicFraction, effectiveForwardFlow, nativeFlow, cardiacOutput, piMean, piRatio, rawPi, flowExcursion, frankStarlingFactor, effectiveContractility, lvSystolicPressure, mapAvThreshold, rpmUnloadingPenalty, preloadRecruitmentBonus, avOpeningThreshold, fullAvOpeningThreshold, preOpeningFraction, preOpeningPressureFraction, hClosedSystole, qClosedSystole, qMeanSystole, baseAvOpeningFraction, afterloadAvModifier: 1, avOpeningFraction, recircFraction, qLow: qDiastole, qHigh: qSystole, hLow: hDiastole, hHigh: hSystole, status, explanation, effectiveMap, effectiveLvPreload };
}

function useToyModel(inputs) {
  return useMemo(() => computeToyModel(inputs), [inputs.rpm, inputs.map, inputs.lvPreload, inputs.rvPreload, inputs.lvContractility, inputs.aorticInsufficiency, inputs.inflowObstruction, inputs.preloadLimitEnabled]);
}

function HQGraph({ model, paused, showPreloadLimit, flipAxes, setFlipAxes, showHeadLines, setShowHeadLines, showPiLines, setShowPiLines, showAllRpmCurves, onHideHQGraph = null }) {
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button onClick={() => setShowPiLines((value) => !value)} variant={showPiLines ? "default" : "outline"} className="rounded-2xl px-3 py-2 text-xs">{showPiLines ? "PI lines on" : "PI lines off"}</Button>
          <Button onClick={() => setShowHeadLines((value) => !value)} variant={showHeadLines ? "default" : "outline"} className="rounded-2xl px-3 py-2 text-xs">{showHeadLines ? "H lines on" : "H lines off"}</Button>
          <Button onClick={() => setFlipAxes((value) => !value)} variant="outline" className="rounded-2xl px-3 py-2 text-xs">{flipAxes ? "Standard axes" : "Flip axes"}</Button>
          {onHideHQGraph ? (
            <Button onClick={onHideHQGraph} variant="outline" className="rounded-2xl px-3 py-2 text-xs">Hide HQ graph</Button>
          ) : null}
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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedMode = window.localStorage.getItem("lvad-dark-mode");
    return storedMode === "true";
  });
  const [rpm, setRpm] = useState(5300);
  const [map, setMap] = useState(82);
  const [svr, setSvr] = useState(1100);
  const [afterloadMode, setAfterloadMode] = useState("map");
  const [preloadMode, setPreloadMode] = useState("cvp");
  const [msfp, setMsfp] = useState(12);
  const [lvPreload, setLvPreload] = useState(18);
  const [rvPreload, setRvPreload] = useState(12);
  const [lvContractility, setLvContractility] = useState(25);
  const [rvContractility, setRvContractility] = useState(25);
  // Aortic insufficiency level: 0..4 (0 none, 1 mild, 2 moderate, 3 mod-severe, 4 severe)
  const [aorticInsufficiencyLevel, setAorticInsufficiencyLevel] = useState(0);
  const AI_LEVEL_TO_PERCENT = [0, 5, 30, 60, 90];
  const aorticInsufficiency = AI_LEVEL_TO_PERCENT[clamp(aorticInsufficiencyLevel, 0, AI_LEVEL_TO_PERCENT.length - 1)];
  const [inflowObstruction, setInflowObstruction] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showPreloadLimit, setShowPreloadLimit] = useState(true);
  const [flipAxes, setFlipAxes] = useState(false);
  const [showHeadLines, setShowHeadLines] = useState(true);
  const [showPiLines, setShowPiLines] = useState(true);
  const [hidePiValue, setHidePiValue] = useState(false);
  const [showAllRpmCurves, setShowAllRpmCurves] = useState(false);
  const [showHQGraph, setShowHQGraph] = useState(true);
  const [clinicalActionStatus, setClinicalActionStatus] = useState("");
  const [preloadCapHint, setPreloadCapHint] = useState("");
  const standManeuverTimeoutRef = useRef<number | null>(null);
  const standManeuverIntervalRef = useRef<number | null>(null);
  const preloadCapHintTimeoutRef = useRef<number | null>(null);
  const [advancedPhysiologyMode, setAdvancedPhysiologyMode] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [showMapExam, setShowMapExam] = useState(false);
  const [showPulmonaryExam, setShowPulmonaryExam] = useState(false);
  const [showPeripheralExam, setShowPeripheralExam] = useState(false);
  const [showEchoResults, setShowEchoResults] = useState(false);
  const [lessonMode, setLessonMode] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("free");
  const [selectedCaseQuestionIndex, setSelectedCaseQuestionIndex] = useState(0);
  const [monitorTick, setMonitorTick] = useState(0);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

const rvRatioFromContractility = (contractility) => clamp(1.25 - 0.023 * contractility, 0.45, 1.25);

  const wetCvpPcwpRatioMultiplier = (pcwp) => {
    if (pcwp <= 16) return 1;
    const excess = clamp((pcwp - 16) / 9, 0, 1);
    return 1 + excess * 0.20;
  };

  const effectiveCvPpcwpRatio = (pcwp, rvContractility) => {
    const baseRatio = rvRatioFromContractility(rvContractility);
    return baseRatio * wetCvpPcwpRatioMultiplier(pcwp);
  };

  const computePcwpFromMsfp = (msfpValue, rpmValue, lvEf, mapValue) => {
    const afterloadFactor = clamp((mapValue - 80) / 100, -0.15, 0.3);
    const contractilityFactor = clamp((50 - lvEf) / 50, 0, 1) * 0.18;
    const rpmUnloadFactor = clamp((rpmValue - 4500) / 1500, 0, 1) * 1.0;
    const factor = clamp(1 + afterloadFactor + contractilityFactor - rpmUnloadFactor, 0.65, 1.35);
    return clamp(msfpValue * factor, 2, 35);
  };

  const computeNextCvpForPcwp = (
    nextPcwp,
    oldCvp,
    oldCo,
    nextCo,
    nextRvContractility = rvContractility,
    previousPcwp = lvPreload
  ) => {
    // Determine wetness from the pre-step PCWP: if the patient was not wet
    // (previousPcwp <= 16), LVAD speed changes should not alter CVP.
    const baseRatio = rvRatioFromContractility(nextRvContractility);
    if (previousPcwp <= 16) return oldCvp;

    // Patient was wet before the step: gentle CVP movement toward the wet-target.
    const wetRatio = baseRatio * wetCvpPcwpRatioMultiplier(nextPcwp);
    const wetTarget = clamp(nextPcwp * wetRatio, 2, 35);
    const minWetCvp = clamp(16 * baseRatio, 2, 35);

    const deltaCo = nextCo - oldCo;
    if (Math.abs(deltaCo) === 0) return wetTarget;

    const hypervolemiaSeverity = clamp((previousPcwp - 18) / 10, 0, 1);
    const rvVulnerability = clamp((30 - nextRvContractility) / 30, 0, 1);

    const allowedChangeFactor = 0.2; // base gentle response
    const allowedChange = allowedChangeFactor * Math.abs(deltaCo);
    if (deltaCo > 0) {
      // In hypervolemia, left-sided congestion can worsen RV loading.
      // During unloading (higher speed), allow a larger CVP fall that scales
      // with how wet the patient is and with RV vulnerability.
      const unloadingBoostFactor = 0.6 * hypervolemiaSeverity + 0.25 * hypervolemiaSeverity * rvVulnerability;
      const boostedAllowedChange = allowedChange * (1 + unloadingBoostFactor);
      const pcwpRelief = Math.max(previousPcwp - nextPcwp, 0);
      const reliefBonus = pcwpRelief * (0.08 + 0.22 * hypervolemiaSeverity) * (1 + 0.35 * rvVulnerability);
      const candidateDrop = boostedAllowedChange + reliefBonus;

      // Keep the floor tied to the wet-threshold equivalent CVP.
      const candidate = clamp(Math.max(wetTarget, oldCvp - candidateDrop), 2, 35);
      return Math.max(candidate, minWetCvp);
    }

    // During speed reduction/reloading, allow a larger CVP rise in wet states,
    // especially when RV reserve is limited.
    const reloadingBoostFactor = 0.6 * hypervolemiaSeverity + 0.25 * hypervolemiaSeverity * rvVulnerability;
    const boostedAllowedRise = allowedChange * (1 + reloadingBoostFactor);
    const pcwpWorsening = Math.max(nextPcwp - previousPcwp, 0);
    const worseningBonus = pcwpWorsening * (0.08 + 0.22 * hypervolemiaSeverity) * (1 + 0.35 * rvVulnerability);
    const candidateRise = boostedAllowedRise + worseningBonus;

    // Move upward toward wetTarget while preserving bounded behavior.
    return clamp(Math.min(wetTarget, oldCvp + candidateRise), 2, 35);
  };

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
    const nextRatio = effectiveCvPpcwpRatio(nextPcwp, nextRvContractility);
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
    setMap(clampedNextMap);
  };
  const updateSvrAbsolute = (nextSvr) => {
    setSvr(clamp(nextSvr, 300, 2000));
  };

  const changePcwpMaintainingRatio = (delta) => {
    const ratio = rvPreload / Math.max(lvPreload, 1);
    const nextPcwp = clamp(lvPreload + delta, 2, 35);
    const nextCvp = clamp(nextPcwp * ratio, 2, 35);
    setLvPreload(nextPcwp);
    setRvPreload(nextCvp);
    setClinicalActionStatus(
      `PCWP ${delta < 0 ? "decreased" : "increased"} ${Math.abs(delta)} mmHg while maintaining the current CVP:PCWP ratio.`
    );
  };

  const DIURETIC_STEP_MMHG = 4;
  const increaseDiuretic = () => changePcwpMaintainingRatio(-DIURETIC_STEP_MMHG);
  const reduceDiuretic = () => changePcwpMaintainingRatio(DIURETIC_STEP_MMHG);
  const addAntihypertensive = () => {
    updateMapAbsolute(map - 8);
    setClinicalActionStatus("Added antihypertensive: MAP reduced by 8 mmHg.");
  };
  const removeAntihypertensive = () => {
    updateMapAbsolute(map + 8);
    setClinicalActionStatus("Removed antihypertensive: MAP increased by 8 mmHg.");
  };

  const bedsideStandManeuver = () => {
    if (standManeuverTimeoutRef.current) window.clearTimeout(standManeuverTimeoutRef.current);
    if (standManeuverIntervalRef.current) window.clearInterval(standManeuverIntervalRef.current);

    const ratio = rvPreload / Math.max(lvPreload, 1);
    const baselinePcwp = lvPreload;
    const baselineCvp = rvPreload;
    const targetPcwp = clamp(baselinePcwp - 5, 2, 35);
    const targetCvp = clamp(targetPcwp * ratio, 2, 35);

    setLvPreload(targetPcwp);
    setRvPreload(targetCvp);
    setClinicalActionStatus("Bedside stand maneuver: PCWP and CVP lowered for 2 seconds, then slowly returning to baseline.");

    const steps = 10;
    const intervalMs = 500;
    const pcwpStep = (baselinePcwp - targetPcwp) / steps;
    const cvpStep = (baselineCvp - targetCvp) / steps;
    let stepCount = 0;

    standManeuverTimeoutRef.current = window.setTimeout(() => {
      standManeuverIntervalRef.current = window.setInterval(() => {
        stepCount += 1;
        setLvPreload((current) => clamp(current + pcwpStep, 2, 35));
        setRvPreload((current) => clamp(current + cvpStep, 2, 35));
        if (stepCount >= steps && standManeuverIntervalRef.current) {
          window.clearInterval(standManeuverIntervalRef.current);
          standManeuverIntervalRef.current = null;
        }
      }, intervalMs);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (standManeuverTimeoutRef.current) window.clearTimeout(standManeuverTimeoutRef.current);
      if (standManeuverIntervalRef.current) window.clearInterval(standManeuverIntervalRef.current);
      if (preloadCapHintTimeoutRef.current) window.clearTimeout(preloadCapHintTimeoutRef.current);
    };
  }, []);

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
      const oldPcwp = lvPreload;
      const oldCvp = rvPreload;
      const oldCo = model.cardiacOutput;
      const nextPcwp = clamp(oldPcwp + rpmDrop / 100, 2, 35);
      const candidateModel = computeToyModel({
        rpm: nextRpm,
        map,
        lvPreload: nextPcwp,
        rvPreload: oldCvp,
        lvContractility,
        aorticInsufficiency,
        inflowObstruction,
        preloadLimitEnabled: showPreloadLimit,
      });
      const nextCo = candidateModel.cardiacOutput;
      const nextCvp = computeNextCvpForPcwp(nextPcwp, oldCvp, oldCo, nextCo, undefined, oldPcwp);
      setRpm(nextRpm);
      setLvPreload(nextPcwp);
      setRvPreload(nextCvp);
    }
  };

  const increaseRpm = () => {
    const currentIndex = AVAILABLE_RPMS.indexOf(rpm);
    const nextRpm = AVAILABLE_RPMS[Math.min(AVAILABLE_RPMS.length - 1, currentIndex + 1)];
    if (nextRpm !== rpm) {
      const rpmRise = nextRpm - rpm;
      const oldPcwp = lvPreload;
      const oldCvp = rvPreload;
      const oldCo = model.cardiacOutput;
      const nextPcwp = clamp(oldPcwp - rpmRise / 100, 2, 35);
      const candidateModel = computeToyModel({
        rpm: nextRpm,
        map,
        lvPreload: nextPcwp,
        rvPreload: oldCvp,
        lvContractility,
        aorticInsufficiency,
        inflowObstruction,
        preloadLimitEnabled: showPreloadLimit,
      });
      const nextCo = candidateModel.cardiacOutput;
      const nextCvp = computeNextCvpForPcwp(nextPcwp, oldCvp, oldCo, nextCo, undefined, oldPcwp);
      setRpm(nextRpm);
      setLvPreload(nextPcwp);
      setRvPreload(nextCvp);
    }
  };

  useEffect(() => {
    const id = window.setInterval(() => setMonitorTick((value) => value + 1), 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!quizMode) {
      setShowMapExam(false);
      setShowPulmonaryExam(false);
      setShowPeripheralExam(false);
      setShowEchoResults(false);
      setClinicalActionStatus("");
    }
  }, [quizMode]);

  useEffect(() => {
    window.localStorage.setItem("lvad-dark-mode", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const effectivePcwp = preloadMode === "msfp"
    ? computePcwpFromMsfp(msfp, rpm, lvContractility, map)
    : lvPreload;
  const effectiveCvp = preloadMode === "msfp"
    ? clamp(effectivePcwp * effectiveCvPpcwpRatio(effectivePcwp, rvContractility), 2, 35)
    : rvPreload;

  const model = useToyModel({ rpm, map, lvPreload: effectivePcwp, rvPreload: effectiveCvp, lvContractility, aorticInsufficiency, inflowObstruction, preloadLimitEnabled: showPreloadLimit });
  const actualCvPcwpRatio = clamp(effectiveCvp / Math.max(effectivePcwp, 1), 0, 3);
  const effectiveFickCo = computeFickCardiacOutput({ model, pumpFlowForDisplay: model.pumpFlow });

  useEffect(() => {
    if (afterloadMode !== "svr") return;

    const evaluateMapTarget = (mapCandidate) => {
      const candidateModel = computeToyModel({
        rpm,
        map: mapCandidate,
        lvPreload: effectivePcwp,
        rvPreload: effectiveCvp,
        lvContractility,
        aorticInsufficiency,
        inflowObstruction,
        preloadLimitEnabled: showPreloadLimit,
      });
      const candidateFickCo = computeFickCardiacOutput({
        model: candidateModel,
        pumpFlowForDisplay: candidateModel.pumpFlow,
      });
      return clamp(
        computeMapFromSvr({
          svr,
          cardiacOutput: candidateFickCo,
          cvp: effectiveCvp,
        }),
        40,
        115
      );
    };

    let guess = map;
    for (let i = 0; i < 10; i += 1) {
      const target = evaluateMapTarget(guess);
      if (Math.abs(target - guess) < 0.05) {
        guess = target;
        break;
      }
      guess += (target - guess) * 0.6;
    }

    const mapTarget = clamp(guess, 40, 115);
    if (Math.abs(mapTarget - map) > 0.15) {
      setMap(mapTarget);
    }
  }, [afterloadMode, svr, effectiveCvp, effectivePcwp, rpm, lvContractility, aorticInsufficiency, inflowObstruction, showPreloadLimit]);

  const suctionCyclePosition = monitorTick % 8;
  const suctionRecoveryFraction = model.suctionMotionActive ? clamp(suctionCyclePosition / 4, 0, 1) : 1;
  const suctionFlowNadir = Math.max(0.4, Math.min(model.pumpFlow, model.theoreticalPreloadCap) * 0.45);
  const suctionPowerNadir = Math.max(1.8, model.powerWatts * 0.65);
  const suctionPiPeak = Math.max(model.piMean + 3.5, 8.0);
  const displayedFlow = model.suctionMotionActive ? suctionFlowNadir + (model.pumpFlow - suctionFlowNadir) * suctionRecoveryFraction : model.pumpFlow;
  const displayedPower = model.suctionMotionActive ? suctionPowerNadir + (model.powerWatts - suctionPowerNadir) * suctionRecoveryFraction : model.powerWatts;
  const displayedPi = model.suctionMotionActive ? suctionPiPeak - (suctionPiPeak - model.piMean) * suctionRecoveryFraction : model.piMean;
  const activeCase = CASE_PRESETS.find((casePreset) => casePreset.id === selectedCaseId);
  const activeCaseQuestions = activeCase?.secondaryQuestions || [];
  const activeCaseQuestion = activeCaseQuestions[selectedCaseQuestionIndex] || activeCaseQuestions[0];
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
    // map preset percent to nearest AI level
    setAorticInsufficiencyLevel(AI_LEVEL_TO_PERCENT.reduce((bestIdx, v, idx) => (Math.abs(v - settings.aorticInsufficiency) < Math.abs(AI_LEVEL_TO_PERCENT[bestIdx] - settings.aorticInsufficiency) ? idx : bestIdx), 0));
    setInflowObstruction(settings.inflowObstruction);
    setSelectedCaseId("free");
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
    setShowEchoResults(false);
  };

  const applyCasePreset = (caseId) => {
    setSelectedCaseId(caseId);
    setSelectedCaseQuestionIndex(0);
    const preset = CASE_PRESETS.find((casePreset) => casePreset.id === caseId);
    if (!preset) return;
    const { settings } = preset;
    setRpm(settings.rpm);
    setMap(settings.map);
    setLvPreload(settings.lvPreload);
    setRvPreload(settings.rvPreload);
    setLvContractility(settings.lvContractility);
    setRvContractility(settings.rvContractility);
    setAorticInsufficiencyLevel(0);
    setInflowObstruction(0);
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
    setShowEchoResults(false);
  };

  const reset = () => {
    setRpm(5300);
    setMap(82);
    setSvr(1100);
    setAfterloadMode("map");
    setLvPreload(18);
    setRvContractility(25);
    setRvPreload(clamp(18 * rvRatioFromContractility(25), 2, 35));
    setLvContractility(25);
    setAorticInsufficiencyLevel(0);
    setInflowObstruction(0);
    setSelectedCaseId("free");
    setSelectedLessonId(1);
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
    setShowEchoResults(false);
  };

  const toggleQuizMode = () => {
    setQuizMode((value) => {
      const nextQuizMode = !value;
      setShowHQGraph(!nextQuizMode);
      return nextQuizMode;
    });
    setShowMapExam(false);
    setShowPulmonaryExam(false);
    setShowPeripheralExam(false);
    setShowEchoResults(false);
  };

  const togglePreloadCapWithHint = () => {
    setShowPreloadLimit((value) => {
      const nextValue = !value;
      setPreloadCapHint(
        nextValue
          ? "Preload cap is on: when venous return and thus PCWP is limited, the model applies a flow ceiling (Qcap), so increasing speed alone may not meaningfully raise flow. The LVAD can't pump blood that it's not receiving."
          : "Preload cap is off: the simulator will not enforce venous-return flow limitation, so flow follows the HQ relationship without a preload ceiling."
      );
      if (preloadCapHintTimeoutRef.current) window.clearTimeout(preloadCapHintTimeoutRef.current);
      preloadCapHintTimeoutRef.current = window.setTimeout(() => {
        setPreloadCapHint("");
        preloadCapHintTimeoutRef.current = null;
      }, 4500);
      return nextValue;
    });
  };

  return (
    <div className={`lvad-app min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 text-slate-950 ${darkMode ? "app-dark" : ""}`}>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className={`flex flex-col justify-between gap-4 rounded-3xl border p-6 shadow-sm backdrop-blur md:flex-row md:items-center ${advancedPhysiologyMode ? "border-amber-200 bg-amber-50/90" : "border-slate-200 bg-white/80"}`}>
          <div>
            <div className="mb-2 flex items-center gap-2"><div className="rounded-2xl bg-slate-950 p-2 text-white"><MiniIcon type="heart" className="h-5 w-5" /></div></div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">LVAD Physiology Visualizer</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">An interactive teaching model for understanding how LVAD speed, preload, afterload, contractility, and pump head shape flow, power, pulsatility, and suction physiology.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setDarkMode((value) => !value)}
              variant={darkMode ? "default" : "outline"}
              className="rounded-2xl"
            >
              {darkMode ? "Dark mode on" : "Dark mode off"}
            </Button>
            <Button onClick={toggleQuizMode} variant={quizMode ? "default" : "outline"} className="rounded-2xl">{quizMode ? "Quiz mode on" : "Quiz mode off"}</Button>
            <Button onClick={togglePreloadCapWithHint} variant={showPreloadLimit ? "default" : "outline"} className="rounded-2xl">{showPreloadLimit ? "Preload cap on" : "Preload cap off"}</Button>
            <Button onClick={() => setShowHQGraph((value) => !value)} variant={showHQGraph ? "outline" : "default"} className="rounded-2xl">{showHQGraph ? "Hide HQ graph" : "Show HQ graph"}</Button>
            <Button onClick={() => setPaused((value) => !value)} variant="outline" className="rounded-2xl">{paused ? "Play oscillation" : "Pause at mean flow"}</Button>
            <Button onClick={() => setAdvancedPhysiologyMode((value) => !value)} variant={advancedPhysiologyMode ? "default" : "outline"} className="rounded-2xl">{advancedPhysiologyMode ? "Advanced mode on" : "Advanced mode off"}</Button>
            <Button onClick={reset} variant="outline" className="rounded-2xl"><MiniIcon type="reset" className="mr-2 h-4 w-4" />Reset</Button>
            <select value={selectedCaseId} onChange={(event) => applyCasePreset(event.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm">
              <option value="free">Case selector</option>
              {CASE_PRESETS.map((casePreset) => <option key={casePreset.id} value={casePreset.id}>{casePreset.label}</option>)}
            </select>
          </div>
        </header>
        {preloadCapHint ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 shadow-sm">
            {preloadCapHint}
          </div>
        ) : null}
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

        {quizMode ? (
          <Card className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <CardContent className="p-3">
              <div className="mb-1 flex items-center gap-2">
                <MiniIcon type="info" className="h-5 w-5 text-slate-600" />
                <div className="text-xs font-black uppercase tracking-wide text-slate-500">Quiz details</div>
              </div>
              <h2 className="text-base font-black tracking-tight text-slate-950">Work through the LVAD physiology before revealing the answer</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {CASE_PRESETS.map((casePreset, index) => (
                  <button
                    key={casePreset.id}
                    type="button"
                    onClick={() => applyCasePreset(casePreset.id)}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-sm font-black transition ${
                      selectedCaseId === casePreset.id
                        ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                    aria-label={`Load quiz case ${index + 1}: ${casePreset.label}`}
                    title={casePreset.label}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-slate-500">Case prompt</div>
                <div className="max-h-32 space-y-3 overflow-y-auto pr-1">
                  {activeCase ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-sm font-semibold leading-5 text-slate-800">{activeCase.question}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Use controller values first, then reveal clinical clues before opening the HQ graph.</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Learner task</div>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        Review the LVAD controller values first. Generate a differential diagnosis before revealing MAP, lung exam, and JVP. Then predict the HQ-curve position and whether increasing or decreasing RPM should improve flow, worsen suction risk, or have limited effect.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-5">
            {quizMode ? (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-700 bg-black p-4 shadow-sm">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-300">Flow</div>
                    <div className="mt-2 flex items-baseline gap-1 font-mono">
                      <span className="text-4xl font-black tabular-nums text-white">{format(displayedFlow, 2)}</span>
                      <span className="text-sm font-semibold text-slate-300">L/min</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-700 bg-black p-4 shadow-sm">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-300">Power</div>
                    <div className="mt-2 flex items-baseline gap-1 font-mono">
                      <span className="text-4xl font-black tabular-nums text-white">{format(displayedPower, 1)}</span>
                      <span className="text-sm font-semibold text-slate-300">W</span>
                    </div>
                  </div>
                  <RpmCard rpm={rpm} onDecrease={decreaseRpm} onIncrease={increaseRpm} showAllCurves={showAllRpmCurves} onToggleShowAllCurves={() => setShowAllRpmCurves((value) => !value)} />
                  <div className="rounded-2xl border border-slate-700 bg-black p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-300">PI</div>
                      <button type="button" onClick={() => setHidePiValue((value) => !value)} className="rounded-lg border border-slate-600 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-slate-800">
                        {hidePiValue ? "show" : "hide"}
                      </button>
                    </div>
                    <div className={`mt-2 font-mono text-4xl font-black tabular-nums text-white ${hidePiValue ? "blur-sm select-none" : ""}`}>
                      {hidePiValue ? "--" : format(displayedPi, 1)}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            
            {showHQGraph ? (
              <HQGraph
                model={model}
                paused={paused}
                showPreloadLimit={showPreloadLimit}
                flipAxes={flipAxes}
                setFlipAxes={setFlipAxes}
                showHeadLines={showHeadLines}
                setShowHeadLines={setShowHeadLines}
                showPiLines={showPiLines}
                setShowPiLines={setShowPiLines}
                showAllRpmCurves={showAllRpmCurves}
                onHideHQGraph={() => setShowHQGraph(false)}
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-slate-950">HQ graph hidden</div>
                    <div className="text-sm text-slate-500">The active HQ curve is hidden for quiz mode. Reveal it when the learner is ready to interpret the pump mechanics.</div>
                  </div>
                  <Button onClick={() => setShowHQGraph(true)} variant="outline" className="rounded-2xl">Show HQ graph</Button>
                </div>
              </div>
            )}

            {!quizMode ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ControllerStatCard title="Flow" value={format(displayedFlow, 2)} unit="L/min" sub={model.suctionMotionActive ? "suction drop" : `Qd ${format(model.qDiastole, 2)} • Qs ${format(model.qSystole, 2)} L/min`} />
                <ControllerStatCard title="Power" value={format(displayedPower, 1)} unit="W" sub={model.suctionMotionActive ? "suction drop" : ""} />
                <RpmCard rpm={rpm} onDecrease={decreaseRpm} onIncrease={increaseRpm} showAllCurves={showAllRpmCurves} onToggleShowAllCurves={() => setShowAllRpmCurves((value) => !value)} />
                <ControllerStatCard title="PI" value={format(displayedPi, 1)} unit="" sub={model.suctionMotionActive ? "PI event" : "((Qmax - Qmin) / Qmean) x 10"} hidden={hidePiValue} onToggleHidden={() => setHidePiValue((value) => !value)} />
              </div>
            ) : null}

            {quizMode ? (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                {showEchoResults ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wide text-slate-500">Bedside POCUS</div>
                        <div className="mt-1 text-sm text-slate-600">Focused ultrasound findings to correlate with controller values and exam clues.</div>
                      </div>
                      <div className={`rounded-xl border px-2 py-1 text-xs font-bold ${aorticInsufficiency > 0 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                        {aorticInsufficiency > 0 ? `AI present (${getAiSeverityLabel(aorticInsufficiency)}, ${format(aorticInsufficiency, 0)}%)` : "No AI detected"}
                      </div>
                    </div>
                    <PlaxEchoImageCard
                      lvContractility={lvContractility}
                      rvContractility={rvContractility}
                      cvpPcwpRatio={model.cvpPcwpRatio}
                      avOpeningFraction={model.avOpeningFraction}
                      hMin={model.hLow}
                    />
                    <div className="flex justify-end">
                      <Button onClick={() => setShowEchoResults(false)} variant="outline" className="rounded-xl bg-white text-xs">
                        Hide POCUS
                      </Button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowEchoResults(true)}
                    className="flex min-h-[180px] w-full items-center justify-between rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-left shadow-sm transition hover:bg-slate-50"
                  >
                    <div>
                      <div className="text-xs font-black uppercase tracking-wide text-slate-500">Bedside POCUS</div>
                      <div className="mt-3 text-lg font-semibold text-slate-900">POCUS image hidden</div>
                      <div className="mt-2 text-sm text-slate-600">Click to reveal ultrasound findings.</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700">Show POCUS</div>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-slate-500">Bedside POCUS</div>
                    <div className="mt-1 text-sm text-slate-600">Focused ultrasound findings to correlate with controller values and exam clues.</div>
                  </div>
                  <div className={`rounded-xl border px-2 py-1 text-xs font-bold ${aorticInsufficiency > 0 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    {aorticInsufficiency > 0 ? `AI present (${getAiSeverityLabel(aorticInsufficiency)}, ${format(aorticInsufficiency, 0)}%)` : "No AI detected"}
                  </div>
                </div>
                <PlaxEchoImageCard
                  lvContractility={lvContractility}
                  rvContractility={rvContractility}
                  cvpPcwpRatio={model.cvpPcwpRatio}
                  avOpeningFraction={model.avOpeningFraction}
                  hMin={model.hLow}
                />
              </div>
            )}

            {false ? (
              <div className="space-y-3">
               <LvPressureWaveformCard model={model} map={map} pcwp={lvPreload} />
                </div>
              ) : null}
          </div>
          <aside className="space-y-5">
              {advancedPhysiologyMode && !quizMode ? (
              <HemodynamicMonitorCard map={map} model={model} displayedPumpFlow={displayedFlow} showDebugPanel={showDebugPanel} onToggleDebug={() => setShowDebugPanel((v) => !v)} pcwp={effectivePcwp} cvp={effectiveCvp} preloadMode={preloadMode} afterloadMode={afterloadMode} targetSvr={svr} />
            ) : null}
            <div className="rounded-3xl border bg-white/80 p-3 shadow-sm">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Physiology controls</div>
              <div className="grid grid-cols-1 gap-3">
                {quizMode ? (
                  <QuizMapCard
                    map={map}
                    model={model}
                    avOpeningFraction={model.avOpeningFraction}
                    revealed={showMapExam}
                    onReveal={() => setShowMapExam(true)}
                  />
                ) : advancedPhysiologyMode ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Afterload state</div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setAfterloadMode("map")}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${afterloadMode === "map" ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                        >
                          MAP
                        </button>
                        <button
                          type="button"
                          onClick={() => setAfterloadMode("svr")}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${afterloadMode === "svr" ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                        >
                          SVR
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preload state</div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setPreloadMode("cvp")}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${preloadMode === "cvp" ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                        >
                          CVP
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreloadMode("msfp")}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${preloadMode === "msfp" ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                        >
                          MSFP
                        </button>
                      </div>
                    </div>
                    <SliderControl
                      compact={advancedPhysiologyMode}
                      label={afterloadMode === "map" ? "MAP" : "SVR"}
                      value={afterloadMode === "map" ? map : svr}
                      setValue={afterloadMode === "map" ? updateMapAbsolute : updateSvrAbsolute}
                      min={afterloadMode === "map" ? 55 : 300}
                      max={afterloadMode === "map" ? 115 : 2000}
                      step={afterloadMode === "map" ? 1 : 25}
                      unit={afterloadMode === "map" ? "mmHg" : "dyn·s·cm⁻⁵"}
                      iconType="gauge"
                      alertTone={afterloadMode === "map" ? mapAlertTone : mapAlertTone}
                      alertNote={afterloadMode === "map" ? mapAlertNote : mapAlertNote}
                      note={afterloadMode === "map" ? (aorticInsufficiency > 0 ? `Effective MAP with AI ${format(model.effectiveMap, 0)} mmHg` : `MAP ${format(map, 0)} mmHg`) : `Computed MAP ${format(map, 0)} mmHg`}
                      helper={afterloadMode === "map" ? "Higher MAP raises diastolic head pressure, tends to reduce flow, and modestly raises PCWP/LVEDP." : "Systemic vascular resistance in standard units. MAP is calculated from CVP, Fick CO, and SVR."}
                    />
                    {preloadMode === "msfp" ? (
                      <SliderControl
                        compact={advancedPhysiologyMode}
                        label="MSFP"
                        value={msfp}
                        setValue={(next) => setMsfp(clamp(next, 2, 35))}
                        min={2}
                        max={35}
                        step={1}
                        unit="mmHg"
                        iconType="waves"
                        alertTone={preloadMode === "msfp" ? "orange" : "normal"}
                        note=""
                        helper=""
                      />
                    ) : null}
                  </div>
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
                    note={aorticInsufficiency > 0 ? `Effective MAP with AI ${format(model.effectiveMap, 0)} mmHg` : `MAP ${format(map, 0)} mmHg`}
                    helper="Higher MAP raises diastolic head pressure, tends to reduce flow, and modestly raises PCWP/LVEDP."
                  />
                )}
                {quizMode ? (
                  <QuizPulmonaryExamCard
                    pcwp={lvPreload}
                    revealed={showPulmonaryExam}
                    onReveal={() => setShowPulmonaryExam(true)}
                  />
                ) : preloadMode === "cvp" ? (
                  <SliderControl
                    compact={advancedPhysiologyMode}
                    label="PCWP / LVEDP"
                    value={aorticInsufficiency > 0 ? format(model.effectiveLvPreload, 1) : format(lvPreload, 1)}
                    setValue={updatePcwp}
                    min={2}
                    max={35}
                    step={1}
                    unit="mmHg"
                    iconType="waves"
                    alertTone={pcwpAlertTone}
                    alertNote={pcwpAlertNote}
                    note={aorticInsufficiency > 0 ? `Effective preload with AI ${format(model.effectiveLvPreload, 1)} mmHg` : undefined}
                    helper="Approximate LV filling pressure / pump inflow pressure during diastole. CVP tracks this unless RV contractility changes."
                  />
                ) : null}
                {quizMode ? (
                  <QuizPeripheralExamCard
                    cvp={rvPreload}
                    revealed={showPeripheralExam}
                    onReveal={() => setShowPeripheralExam(true)}
                  />
                ) : preloadMode === "cvp" ? (
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
                        : "Tracks PCWP by CVP:PCWP ratio. Adjust RV contractility to change it."
                    }
                    note={`CVP:PCWP ${format(rvPreload / Math.max(lvPreload, 1), 2)} : 1`}
                  />
                ) : null}
{quizMode ? (

  <>

  <div className="rounded-2xl border bg-white/70 p-4 shadow-sm">
    <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Clinical actions</div>
    <div className="grid gap-2 sm:grid-cols-2">
      <Button onClick={increaseDiuretic} variant="outline" className="rounded-xl bg-white text-xs">Increase diuretic</Button>
      <Button onClick={reduceDiuretic} variant="outline" className="rounded-xl bg-white text-xs">Reduce diuretic</Button>
      <Button onClick={addAntihypertensive} variant="outline" className="rounded-xl bg-white text-xs">Add antihypertensive</Button>
      <Button onClick={removeAntihypertensive} variant="outline" className="rounded-xl bg-white text-xs">Remove antihypertensive</Button>
      <Button onClick={bedsideStandManeuver} variant="secondary" className="rounded-xl bg-white text-xs sm:col-span-2">Bedside stand maneuver</Button>
    </div>
    <p className="mt-3 text-xs leading-5 text-slate-600">These actions simulate bedside medication and physiologic maneuvers for the LVAD patient. Diuretics shift PCWP while maintaining the current CVP:PCWP ratio.</p>
    {clinicalActionStatus ? (
      <p className="mt-3 text-xs leading-5 text-slate-700">{clinicalActionStatus}</p>
    ) : null}
  </div>

  </>

) : (

  <>

    <SliderControl compact={advancedPhysiologyMode} label="LV contractility / EF" value={lvContractility} setValue={updateLvContractility} min={0} max={50} step={1} unit="%" iconType="heart" helper={advancedPhysiologyMode ? `AV-opening threshold still applies; lower EF is treated as ${complianceProfile.lvLabel}.` : "AV-opening EF threshold shifts with MAP, RPM unloading, and PCWP/LVEDP preload recruitment."} />
    <SliderControl compact={advancedPhysiologyMode} label="RV contractility" value={rvContractility} setValue={updateRvContractility} min={0} max={50} step={1} unit="%" iconType="heart" helper={advancedPhysiologyMode ? `Lower RV function increases right-sided stiffness and blunts forward transfer to PCWP.` : "0% = poor RV contractility; 50% = maximum RV contractility. Higher RV contractility lowers CVP:PCWP."} />
    {advancedPhysiologyMode ? (
      <SliderControl
        compact={advancedPhysiologyMode}
        label="Aortic insufficiency"
        value={aorticInsufficiencyLevel}
        setValue={setAorticInsufficiencyLevel}
        min={0}
        max={4}
        step={1}
        unit=""
        iconType="info"
        note={`Severity: ${getAiSeverityLabel(aorticInsufficiency)}`}
        alertTone={aorticInsufficiency >= 50 ? "red" : aorticInsufficiency >= 30 ? "orange" : "normal"}
        helper="Higher AI raises LV preload and lowers effective aortic pressure, increasing pump flow while reducing pulsatility."
      />
    ) : null}

    <div className="mt-3 grid grid-cols-2 gap-3">
      <div>
        <div className="mb-1 text-xs font-semibold text-slate-500">Frank–Starling (LV)</div>
        <MiniFrankStarlingCurve preload={lvPreload} contractility={lvContractility} kind="LV" />
      </div>
      <div>
        <div className="mb-1 text-xs font-semibold text-slate-500">Frank–Starling (RV)</div>
        <MiniFrankStarlingCurve preload={rvPreload} contractility={rvContractility} kind="RV" />
      </div>
    </div>

  </>

)}

              </div>
            </div>
          </aside>
        </div>
        {quizMode && activeCase && activeCaseQuestions.length > 0 ? (
          <Card className="rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">
                Follow-up questions
              </div>
              <div className="mt-2 text-sm font-black leading-6 text-slate-950">
                Question {selectedCaseQuestionIndex + 1} of {activeCaseQuestions.length}: {activeCaseQuestion.question}
              </div>
              <div className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs leading-5 text-slate-700">
                <span className="font-bold text-indigo-700">Hint: </span>
                {activeCaseQuestion.hint}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl px-3 py-2 text-xs"
                  onClick={() => setSelectedCaseQuestionIndex((value) => Math.max(0, value - 1))}
                >
                  ← Previous
                </Button>
                <div className="text-xs font-bold text-slate-500">{selectedCaseQuestionIndex + 1} / {activeCaseQuestions.length}</div>
                <Button
                  variant="outline"
                  className="rounded-2xl px-3 py-2 text-xs"
                  onClick={() => setSelectedCaseQuestionIndex((value) => Math.min(activeCaseQuestions.length - 1, value + 1))}
                >
                  Next →
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
        <footer className="rounded-3xl border bg-white/70 p-4 text-xs leading-5 text-slate-500 shadow-sm">
          <div className="flex flex-col gap-3">
            <div>This prototype is for education only. It does not use Abbott proprietary pump equations and should not be used for patient care. HeartMate 3 displayed flow is estimated, not directly measured; clinical speed optimization requires LVAD parameters, MAP, symptoms, echo, invasive hemodynamics, and LVAD team judgment.</div>
            <button
              type="button"
              onClick={() => setShowAssumptions((value) => !value)}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span>Assumptions and Rules</span>
              <span className="text-slate-500">{showAssumptions ? "▲ Hide" : "▼ Show"}</span>
            </button>
            {showAssumptions ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">HQ curve and head pressure</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">At fixed RPM, the operating point is selected from the fitted HQ curve. Diastolic head is approximated as MAP - PCWP/LVEDP. Lower head corresponds to higher pump flow along the curve; higher head corresponds to lower pump flow.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">H = MAP - PCWP/LVEDP</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">Mean pump flow</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">The dot cycles between diastolic and systolic operating points. Mean displayed flow is time-weighted toward diastole using a simple 2/3 diastole and 1/3 systole approximation.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">Qmean = 2/3 × Qdiastole + 1/3 × Qsystole</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">Aortic valve opening</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">The EF threshold for AV opening shifts with MAP, RPM, and preload. Higher MAP and higher RPM make AV opening harder; higher PCWP/LVEDP modestly helps opening through preload recruitment. Near-complete opening occurs about 20 EF points above the threshold.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">AV threshold ≈ MAP effect + RPM unloading - preload recruitment</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">Aortic regurgitation</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">AI increases LV diastolic preload and lowers effective aortic pressure, narrowing the pump head gradient. That makes measured pump flow higher while effective systemic flow falls and PI tends to decrease.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">Effective systemic flow = pump flow × (1 − recirculation)</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">Preload supply cap</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Two parallel pathways blend to set the final Qcap. Low PCWP pathway: underfillCap = 2.5 + 5.5 × (PCWP − 5) / 8. RV-limited pathway: rvLimitedCap = 8.5 × (1 − 0.45 × max(0, (CVP/PCWP − 0.8) / 0.7)). The lower blended result is Qcap.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">Qcap = min(blended underfill, blended RV); Displayed Q = min(HQ Q, Qcap)</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">Pulsatility index</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">PI is modeled from the cyclic flow excursion. Larger separation between Qmax and Qmin raises PI, while severe preload limitation or suction-like behavior can collapse or destabilize PI.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">PI ≈ ((Qmax - Qmin) / Qmean) × 10</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">Advanced physiology mode</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Advanced mode keeps the same visualizer but links volume changes to PCWP and CVP through nonlinear LV/RV stiffness. Stiffness is intentionally mild in the mid Frank-Starling range and rises mainly near the plateau. Poor RV function raises CVP more and transfers less volume to left-sided filling.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">Current: {complianceProfile.lvLabel}; {complianceProfile.rvLabel}</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">MAP → wedge pressure</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Direct MAP changes do not independently shift PCWP/LVEDP in CVP preload mode. In MSFP preload mode, MAP contributes to the computed effective PCWP through the MSFP-to-PCWP conversion factor.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">CVP mode: ΔMAP does not directly change PCWP</div>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">MSFP mode: PCWP = clamp(MSFP × factor(MAP, RPM, LV EF), 2, 35)</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">MAP → CVP</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">MAP does not directly change CVP. In CVP preload mode, CVP follows PCWP via the RV contractility-derived CVP:PCWP ratio when PCWP is updated. In MSFP preload mode, effective CVP is derived from effective PCWP and the same ratio.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">CVP mode: CVP ≈ PCWP × CVP:PCWP ratio (on preload updates)</div>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">MSFP mode: effective CVP = clamp(effective PCWP × CVP:PCWP ratio, 2, 35)</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">LV contractility → wedge pressure</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Below an EF/contractility of about 35%, the model mainly changes AV-opening behavior. Once LV contractility rises above 35%, additional native recovery lowers PCWP/LVEDP more strongly, representing improved native LV unloading.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">If EF &gt; 35: ΔPCWP = -Δ(EF above 35) × (10 / 15)</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="font-bold text-slate-800">RV contractility → CVP:PCWP ratio</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">RV contractility controls how much right-sided pressure is required to support left-sided filling. Poor RV contractility produces a higher CVP:PCWP ratio; better RV contractility lowers the ratio.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">CVP:PCWP = clamp(1.25 - 0.023 × RV contractility, 0.45, 1.25)</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm md:col-span-2">
                    <div className="font-bold text-slate-800">RPM → wedge pressure</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Changing RPM secondarily changes PCWP/LVEDP in the direction expected from LV unloading. Increasing RPM lowers PCWP/LVEDP; decreasing RPM raises PCWP/LVEDP. In this version, CVP is not directly changed by RPM unless another rule or mode links the pressure change forward.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">RPM increase: ΔPCWP = -ΔRPM / 100</div>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">RPM decrease: ΔPCWP = +ΔRPM / 100</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm md:col-span-2">
                    <div className="font-bold text-slate-800">SVR mode and MAP calculation</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">In SVR mode, MAP is derived from the user-set SVR value, the calculated Fick cardiac output (pump + native flow accounting for aortic insufficiency), and the effective CVP. The model iterates to find the MAP that satisfies this relationship. Both the set SVR and the back-calculated SVR from the current MAP/CVP/CO are shown in debug mode for verification.</p>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">MAP = CVP + (SVR × Fick CO) / 80</div>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-700">Fick CO = Pump flow (or effective forward flow) + Native flow</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </footer>
      </div>
      <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500"><div>Created by Dr. Rudy Unni, MD</div><div className="mt-1 inline-flex rounded-xl border bg-white px-3 py-1 text-[11px] font-medium text-slate-500">LVAD FlowLab v7.9 - case selector</div></footer>
    </div>
  );
}
