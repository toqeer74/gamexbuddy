import { useEffect, useState } from "react";

export default function usePrefersReducedMotion(){
  const [reduced, setReduced] = useState(false);
  useEffect(()=>{
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return ()=> mq.removeEventListener("change", handler);
  },[]);
  return reduced;
}

