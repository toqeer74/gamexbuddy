import React from "react";

export default function LazySection({ children, rootMargin = "300px" }: { children: React.ReactNode; rootMargin?: string }){
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current || shown) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        setShown(true);
        obs.disconnect();
      }
    }, { rootMargin });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [shown, rootMargin]);

  return <div ref={ref}>{shown ? children : null}</div>;
}

