import { AnimatePresence, motion } from "motion/react";

interface SplashScreenProps {
  visible: boolean;
  onDone: () => void;
}

const BUBBLES = Array.from({ length: 8 }, (_, i) => ({
  key: i,
  width: 10 + ((i * 7) % 30),
  height: 10 + ((i * 11) % 30),
  left: `${5 + ((i * 12) % 85)}%`,
  duration: 2 + (i % 3),
  delay: (i * 0.2) % 1.5,
  yEnd: -(500 + ((i * 40) % 300)),
}));

export default function SplashScreen({ visible, onDone }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center ocean-gradient overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={(def) => {
            if ((def as Record<string, unknown>).opacity === 0) onDone();
          }}
        >
          {/* Animated bubbles */}
          {BUBBLES.map((b) => (
            <motion.div
              key={b.key}
              className="absolute rounded-full bg-white/10"
              style={{
                width: b.width,
                height: b.height,
                left: b.left,
                bottom: -40,
              }}
              animate={{ y: [0, b.yEnd], opacity: [0, 0.6, 0] }}
              transition={{
                duration: b.duration,
                delay: b.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Swimming fish */}
          <motion.div
            className="absolute top-1/4 text-5xl"
            initial={{ x: -80 }}
            animate={{ x: 500 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
          >
            🐠
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 text-4xl"
            initial={{ x: 500 }}
            animate={{ x: -80 }}
            transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }}
          >
            🐟
          </motion.div>

          {/* Logo + title */}
          <motion.div
            className="flex flex-col items-center gap-4 px-8 text-center"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "backOut" }}
          >
            <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shadow-2xl border border-white/20">
              <span className="text-5xl">🐡</span>
            </div>
            <h1 className="font-display text-3xl text-white leading-tight tracking-wide">
              AI Aquarium
              <br />
              <span className="italic text-white/80">Assistant</span>
            </h1>
            <p className="font-body text-sm text-white/60 tracking-widest uppercase">
              Your fish care companion
            </p>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="absolute bottom-16 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-white/60"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
