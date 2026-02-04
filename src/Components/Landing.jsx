import { motion } from "framer-motion";
import AnimatedCursor from "./AnimatedCursor";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
};

function Landing({ onLogin, onSignup }) {
  return (
    <div className=" relative min-h-screen bg-slate-900 text-white overflow-hidden noise-bg">
      <AnimatedCursor />

      <motion.div
        className="min-h-screen flex items-center justify-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="text-center space-y-6 z-10">
          {/* Title */}
          <motion.h1 variants={item} className="text-4xl font-bold">
            Learning Queue
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={item} className="text-slate-400 max-w-sm mx-auto">
            Save, organize, and complete your learning resources in one place.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={item} className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              Login
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignup}
              className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
            >
              Sign Up
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Landing;
