import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    x: s % 60,
  };
}

function Flip({ value, label }: { value: number; label: string }) {
  return (
    <div className="flip" aria-label={label}>
      <motion.div
        key={value}
        className="flip__value"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: -90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <div className="flip__label">{label}</div>
    </div>
  );
}

export default function HeroCountdownPro({ targetISO }: { targetISO: string }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = Math.max(0, target - now);
  const { d, h, m, x } = parts(left);

  return (
    <div className="countdown" role="timer" aria-live="polite">
      <Flip value={d} label="DAYS" />
      <Flip value={h} label="HRS" />
      <Flip value={m} label="MIN" />
      <Flip value={x} label="SEC" />
    </div>
  );
}

