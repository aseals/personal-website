import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import type { Project } from "@shared/schema";

interface ProjectViewerProps {
  project: Project;
  onMouseLeave: () => void;
  cursorProgress: number;
  onClose: () => void;
  /** Click-activated viewers render a backdrop so clicking outside closes. */
  showBackdrop?: boolean;
}

export default function ProjectViewer({
  project,
  onMouseLeave,
  cursorProgress,
  onClose,
  showBackdrop = false,
}: ProjectViewerProps) {
  // Calculate x position based on cursor progress; keep viewer centered
  // horizontally so larger widths don't clip off the left edge of the viewport.
  const xOffset = -50 + (cursorProgress - 0.5) * 10;

  // Detect video aspect ratio so landscape clips aren't cropped by a 9:16 frame
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const isLandscape = aspectRatio !== null && aspectRatio > 1;

  return (
    <>
      {showBackdrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}
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
      className={`fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-[5%] flex flex-col items-center justify-start sm:block w-full z-50 overflow-y-auto max-h-screen sm:max-h-[90vh] py-6 sm:py-0 ${
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
          aria-label="Close"
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="mt-4 mx-4 sm:mx-0 bg-background rounded-lg p-4 text-foreground shadow-sm">
        <h3 className="font-medium text-lg">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.type}</p>
        {project.description && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            {project.description}
          </p>
        )}
      </div>
      </motion.div>
    </>
  );
}