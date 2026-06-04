"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingEffect } from "@/components/glowing-effect";

interface VSLPlayerProps {
  videoUrl?: string;
}

export function VSLPlayer({ videoUrl }: VSLPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_0px_rgba(0,0,0,1),0_0_60px_10px_rgba(0,0,0,0.8)]">
      <GlowingEffect
        disabled={false}
        borderWidth={1}
        spread={80}
        proximity={100}
        inactiveZone={0}
        movementDuration={1.5}
      />

      {/* Video area */}
      <div className="relative aspect-video bg-[#0d0d0d] overflow-hidden">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Skeleton lines */}
              <div className="absolute inset-0 flex flex-col justify-center gap-4 px-8 py-12 pointer-events-none">
                <div className="h-px bg-white/[0.04] w-[82%]" />
                <div className="h-px bg-white/[0.04] w-[67%]" />
                <div className="h-px bg-white/[0.04] w-[91%]" />
                <div className="h-px bg-white/[0.04] w-[48%]" />
                <div className="h-px bg-white/[0.04] w-[73%]" />
              </div>

              {/* Play button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-[56px] h-[56px] flex items-center justify-center bg-[#1a1a1a] border border-white/[0.1] cursor-pointer transition-all duration-300 hover:border-[#FFBF00]/40 hover:bg-[#1e1e1e] active:scale-95"
                style={{
                  boxShadow:
                    "0 0 20px 4px rgba(255,191,0,0.25), 0 0 60px 10px rgba(255,191,0,0.08)",
                }}
                aria-label="Play video"
              >
                {/* Triangle SVG — consistent cross-browser */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-[2px]"
                >
                  <polygon points="4,2 16,9 4,16" fill="#e0e0e0" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-[#555555] text-xs tracking-[0.3em] font-light uppercase">
                    Video Coming Soon
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
