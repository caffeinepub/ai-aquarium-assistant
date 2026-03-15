import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface CatEatsFishAnimationProps {
  isVisible: boolean;
  onDone: () => void;
}

export default function CatEatsFishAnimation({
  isVisible,
  onDone,
}: CatEatsFishAnimationProps) {
  const [phase, setPhase] = useState<"run" | "eat" | "happy" | "done">("run");

  useEffect(() => {
    if (!isVisible) {
      setPhase("run");
      return;
    }
    setPhase("run");
    const t1 = setTimeout(() => setPhase("eat"), 900);
    const t2 = setTimeout(() => setPhase("happy"), 1300);
    const t3 = setTimeout(() => setPhase("done"), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  useEffect(() => {
    if (phase === "done") onDone();
  }, [phase, onDone]);

  return (
    <AnimatePresence>
      {isVisible && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.55)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Scene container */}
          <div className="relative w-80 h-48 flex items-center">
            {/* Fish — sits in center, disappears when eaten */}
            <AnimatePresence>
              {phase === "run" && (
                <motion.div
                  className="absolute text-5xl"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                  initial={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  🐟
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cat — runs from left to center, then bounces happy */}
            <motion.div
              className="absolute text-6xl"
              style={{ top: "50%", transform: "translateY(-50%)" }}
              animate={{
                x:
                  phase === "run"
                    ? ["0px", "120px"]
                    : phase === "eat"
                      ? "120px"
                      : "120px",
                rotate: phase === "happy" ? [0, -15, 15, -10, 10, 0] : 0,
                scale: phase === "happy" ? [1, 1.2, 1.1] : 1,
              }}
              initial={{ x: "0px" }}
              transition={{
                x: { duration: 0.9, ease: "easeInOut" },
                rotate: { duration: 0.5, delay: 0 },
                scale: { duration: 0.5 },
              }}
            >
              {phase === "eat" || phase === "happy" ? "😺" : "🐱"}
            </motion.div>

            {/* "Yum!" bubble */}
            <AnimatePresence>
              {phase === "happy" && (
                <motion.div
                  className="absolute font-display text-lg text-white bg-teal-500 rounded-full px-4 py-2 shadow-xl"
                  style={{ top: "10%", right: "10%" }}
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  Yum! 😋
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Caption */}
          <motion.p
            className="absolute bottom-12 font-body text-white/80 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {phase === "run"
              ? "Here comes the cat..."
              : phase === "eat"
                ? "Nom nom nom!"
                : "That fish was delicious! 🐾"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
