import { useEffect, useRef } from "react";

function MouseFollower() {
  const circleRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      // smooth follow (lerp)
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(
          ${pos.current.x - 15}px,
          ${pos.current.y - 15}px,
          0
        )`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={circleRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full
                 bg-blue-500/30 blur-sm
                 pointer-events-none z-50"
    />
  );
}

export default MouseFollower;
