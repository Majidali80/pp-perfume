"use client";

import { useEffect, useRef } from "react";

const HeaderBar = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      const scrollWidth = marquee.scrollWidth;
      let position = 0;

      const animate = () => {
        if (marquee) {
          position -= 1;
          if (position <= -scrollWidth) position = 0;
          marquee.style.transform = `translateX(${position}px)`;
          requestAnimationFrame(animate);
        }
      };

      const animationId = requestAnimationFrame(animate);

      // Cleanup animation on unmount
      return () => cancelAnimationFrame(animationId);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-700 to-purple-400 text-white py-2 overflow-hidden relative">
      <div
        ref={marqueeRef}
        className="whitespace-nowrap text-center text-sm md:text-base font-semibold animate-marquee"
      >
        Shipping Free for Purchases Above PKR 10,000! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Shipping Free for Purchases Above PKR 10,000! &nbsp;&nbsp;&nbsp;&nbsp;
        Shipping Free for Purchases Above PKR 10,000!
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            font-size: 12px;
            padding-left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HeaderBar;