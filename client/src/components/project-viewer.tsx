import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import type { Project } from "@shared/schema";

interface ProjectViewerProps {
  project: Project;
  onMouseLeave: () => void;
  cursorProgress: number;
  onClose: () => void;
}

export default function ProjectViewer({ project, onMouseLeave, cursorProgress, onClose }: ProjectViewerProps) {
  // Calculate x position based on cursor progress
  const xOffset = -85 + (cursorProgress - 0.5) * 10;

  // Detect video aspect ratio so landscape clips aren't cropped by a 9:16 frame
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const isLandscape = aspectRatio !== null && aspectRatio > 1;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: window.innerWidth >= 640 ? `${xOffset}%` : 0
      }}
      transition={{ 
        x: { type: "spring", stiffness: 100, damping: 20 }
      }}
      exit={{ 
        scale: 0.8,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className={`fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-[10%] flex items-center justify-center sm:block w-full z-50 ${
        isLandscape ? "sm:max-w-[960px]" : "sm:max-w-[540px]"
      }`}
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-black rounded-xl overflow-hidden shadow-xl w-[calc(100%-2rem)] sm:w-full">
        <div
          className="relative"
          style={{ aspectRatio: aspectRatio ?? 9 / 16 }}
        >
          <video
            src={project.videoUrl}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (v.videoWidth && v.videoHeight) {
                setAspectRatio(v.videoWidth / v.videoHeight);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 sm:hidden"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-medium text-lg">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.type}</p>
      </div>
    </motion.div>
  );
}