import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectViewerProps {
  project: Project;
  onMouseLeave: () => void;
  cursorProgress: number;
  onClose: () => void;
}

export default function ProjectViewer({ project, onMouseLeave, cursorProgress, onClose }: ProjectViewerProps) {
  // Calculate x position based on cursor progress - only used for desktop
  const xOffset = -85 + (cursorProgress - 0.5) * 10;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: window.innerWidth >= 1024 ? `${xOffset}%` : 0
      }}
      transition={{ 
        x: { type: "spring", stiffness: 100, damping: 20 }
      }}
      exit={{ 
        scale: 0.8,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className="fixed inset-0 lg:inset-auto lg:left-1/2 lg:top-[10%] flex items-center justify-center lg:block w-full lg:max-w-[330px] z-50"
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-black rounded-xl overflow-hidden shadow-xl w-[calc(100%-2rem)] lg:w-full">
        <div className="aspect-[9/16] relative">
          <video
            src={project.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 lg:hidden"
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