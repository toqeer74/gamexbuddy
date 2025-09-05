import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ClickNeon = "pink" | "cyan" | "violet" | "lime" | "blue";

type SizeKey = "md" | "lg" | "hero";

export function GxButton({
  children,
  className,
  onClick,
  clickNeon = "cyan",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { clickNeon?: ClickNeon; size?: SizeKey }) {
  const sizes: Record<SizeKey, string> = {
    md: "px-5 py-3 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-xl",
    hero: "px-8 py-4 text-lg rounded-2xl",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn("gx-btn", sizes[size], className)}
      data-clickneon={clickNeon}
      onClick={onClick}
      {...props}
    >
      {children}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileTap={{ opacity: 0.25 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 200px at var(--x,50%) var(--y,50%), color-mix(in oklab, var(--_accent) 60%, white 0%) 0%, transparent 60%)",
        }}
      />
    </motion.button>
  );
}

