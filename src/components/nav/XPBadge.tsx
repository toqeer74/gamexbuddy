import { useEffect, useRef, useState } from "react";
import { getPointsBalance } from "@/lib/points";
import { subscribePoints, getLastPoints } from "@/lib/points-bus";
import { motion, useAnimationControls } from "framer-motion";

export function XPBadge() {
  const [xp, setXp] = useState<number>(getLastPoints());
  const prev = useRef<number>(xp);
  const controls = useAnimationControls();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (getLastPoints() === 0) {
        try {
          const { balance } = await getPointsBalance();
          if (!mounted) return;
          setXp(balance);
          prev.current = balance;
        } catch {}
      }
    })();

    const unsub = subscribePoints((v) => {
      setXp(v);
      if (v > prev.current) {
        controls.start(
          {
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 0 rgba(0,0,0,0)",
              "0 0 16px rgba(41,240,255,.55)",
              "0 0 0 rgba(0,0,0,0)",
            ],
          },
          { duration: 0.35 }
        );
      }
      prev.current = v;
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [controls]);

  return (
    <motion.span
      animate={controls}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border border-white/10"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
      }}
      title="Your XP"
    >
      <span className="opacity-80">XP</span>
      <span className="tabular-nums">{xp}</span>
    </motion.span>
  );
}

export default XPBadge;

