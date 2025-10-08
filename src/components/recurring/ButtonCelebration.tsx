import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FxMode = "confetti" | "burst" | "spray" | "sparkles";

interface ButtonCelebrationProps {
  active: boolean;
  mode: FxMode;
}

export function ButtonCelebration({ active, mode }: ButtonCelebrationProps) {
  if (!active) return null;

  const pieces = mode === "sparkles" ? 12 : 24; // Fewer, more intentional particles

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-50">
      {Array.from({ length: pieces }).map((_, i) => {
        const angleBase = (i / pieces) * Math.PI * 2;
        const hue = (i * 47) % 360;

        let x = 0, y = 0, rot = 0, dur = 0.9, delay = 0, scale = 1;
        if (mode === "confetti") {
          // Elegant upward arc
          const dist = 40 + (i % 4) * 10;
          const angle = angleBase - Math.PI / 2; // Start upward
          x = Math.cos(angle) * dist * 1.2;
          y = Math.sin(angle) * dist - Math.abs(Math.cos(angleBase)) * 15; // Arc down
          rot = (i * 90) % 360; // Simpler rotation
          scale = 0.8 + (i % 3) * 0.3; // Subtle size variation
          delay = (i % 4) * 0.02;
          dur = 0.8 + (i % 3) * 0.1;
        } else if (mode === "burst") {
          // Quick radial burst
          const dist = 30 + (i % 3) * 8;
          x = Math.cos(angleBase) * dist;
          y = Math.sin(angleBase) * dist * 0.7;
          rot = angleBase * (180 / Math.PI); // Rotate outward
          scale = 0.9 + (i % 2) * 0.2;
          dur = 0.6;
          delay = (i % 3) * 0.015;
        } else if (mode === "spray") {
          // Controlled spray pattern
          const random = (seed: number) => Math.sin(seed * 999) * 0.5 + 0.5;
          const dist = 35 + random(i) * 20;
          const jitter = angleBase + (random(i + 3) - 0.5) * 0.4; // Less chaos
          x = Math.cos(jitter) * dist;
          y = Math.sin(jitter) * dist * 0.8 - 10;
          rot = jitter * (180 / Math.PI);
          scale = 0.7 + random(i + 11) * 0.4;
          dur = 0.7 + random(i + 13) * 0.2;
          delay = random(i + 17) * 0.04;
        } else {
          // sparkles - elegant twinkling
          const dist = 25 + (i % 3) * 10;
          x = Math.cos(angleBase) * dist;
          y = Math.sin(angleBase) * dist * 0.9;
          rot = 0; // No rotation, just scale
          scale = 1.0 + (i % 2) * 0.3;
          dur = 0.6 + (i % 3) * 0.15;
          delay = (i % 3) * 0.025;
        }

        const commonProps = {
          initial: { x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 },
          animate: { 
            x, 
            y, 
            scale: [0, scale * 1.1, scale, 0], // Pop in, settle, fade
            rotate: rot, 
            opacity: [0, 1, 1, 0] 
          },
          transition: { 
            duration: dur,
            times: [0, 0.2, 0.7, 1],
            ease: "easeOut" as any,
            delay 
          },
          className: "absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5",
        };

        if (mode === "sparkles") {
          return (
            <motion.span
              key={`sp-${i}`}
              {...commonProps}
              animate={{
                ...commonProps.animate,
                scale: [0, scale * 1.3, scale * 0.8, scale * 1.1, 0],
                opacity: [0, 1, 0.8, 1, 0],
              }}
              transition={{
                ...commonProps.transition,
                times: [0, 0.15, 0.4, 0.7, 1],
              }}
              className={cn(commonProps.className, "h-2 w-2")}
              style={{
                background: "radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, transparent 70%)",
                boxShadow: "0 0 8px 2px rgba(251, 191, 36, 0.6)",
                borderRadius: "50%",
              }}
            />
          );
        }

        return (
          <motion.span
            key={`p-${i}`}
            {...commonProps}
            style={{ 
              background: `hsl(${hue}, 70%, 60%)`,
              boxShadow: `0 0 4px hsla(${hue}, 70%, 60%, 0.5)`,
            }}
            className={cn(commonProps.className, "h-2.5 w-2.5 rounded-sm")} 
          />
        );
      })}
    </div>
  );
}
