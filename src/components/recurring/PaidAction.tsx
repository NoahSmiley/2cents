import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonCelebration } from "./ButtonCelebration";
import { useEffect } from "react";

type FxMode = "confetti" | "burst" | "spray" | "sparkles";

interface PaidActionProps {
  pending: boolean;
  onClick: () => void;
  celebrate: boolean;
  fx: FxMode;
}

export function PaidAction({ pending, onClick, celebrate, fx }: PaidActionProps) {
  const controls = useAnimation();

  // Trigger celebration animation when celebrate becomes true
  useEffect(() => {
    if (celebrate) {
      // Play success sound
      playSuccessSound();
      
      // Trigger button pop animation - simple scale only
      controls.start({
        scale: [1, 1.15, 1],
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
  }, [celebrate, controls]);

  const handleClick = () => {
    if (pending) return;
    onClick();
  };

  return (
    <div className="relative inline-block">
      <ButtonCelebration active={celebrate} mode={fx} />

      <motion.button
        onClick={handleClick}
        aria-disabled={pending}
        animate={controls}
        className={cn(
          "relative inline-flex items-center justify-center h-9 px-3 rounded-lg text-sm font-medium",
          "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
          "shadow-md hover:shadow-lg",
          pending ? "cursor-default" : "hover:from-emerald-600 hover:to-emerald-700",
          "transition-all duration-200"
        )}
        whileHover={pending ? undefined : { scale: 1.05, y: -2 }}
        whileTap={pending ? undefined : { scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!pending ? (
            <motion.span
              key="mark"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 font-medium"
            >
              <span className="text-base">✓</span> Mark paid
            </motion.span>
          ) : (
            <motion.span
              key="paid"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.2, 
                ease: "easeOut"
              }}
              className="inline-flex items-center gap-1.5 font-semibold"
            >
              <span className="text-base">✅</span> Paid!
            </motion.span>
          )}
        </AnimatePresence>

        {/* Shimmer effect while pending */}
        {pending && (
          <motion.span
            key="shimmer"
            initial={{ left: "-50%" }}
            animate={{ left: "150%" }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut",
              repeat: 1
            }}
            className="pointer-events-none absolute top-0 bottom-0 w-16 skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        )}
      </motion.button>
    </div>
  );
}

// Play a satisfying success sound
function playSuccessSound() {
  try {
    // Create a simple success tone using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First note (higher)
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    oscillator1.frequency.value = 800;
    gainNode1.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.15);
    
    // Second note (lower, slightly delayed)
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    oscillator2.frequency.value = 1000;
    gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime + 0.05);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    oscillator2.start(audioContext.currentTime + 0.05);
    oscillator2.stop(audioContext.currentTime + 0.25);
  } catch (e) {
    // Silently fail if audio context is not supported
  }
}
