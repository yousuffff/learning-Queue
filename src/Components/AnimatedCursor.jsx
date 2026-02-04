import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedCursor() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);

    // detect hover on interactive elements
    const addHover = () => setIsHovering(true);
    const removeHover = () => setIsHovering(false);

    const targets = document.querySelectorAll("button, a");

    targets.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <>
      {/* INNER DOT (instant) */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50"
        style={{
          transform: `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`,
        }}
      />

      {/* OUTER RING (smooth) */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-white/40 rounded-full pointer-events-none z-50"
        animate={{
          x: mouse.x,
          y: mouse.y,
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.6 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.6,
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}

export default AnimatedCursor;
