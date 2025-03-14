import { motion } from "framer-motion";
import type { Project } from "@shared/schema";

interface ProjectViewerProps {
  project: Project;
  onMouseLeave: () => void;
  cursorProgress: number;
}

export default function ProjectViewer({ project, onMouseLeave, cursorProgress }: ProjectViewerProps) {
  // Calculate x position based on cursor progress
  // Move 85% left by default (-85%), then add subtle movement based on cursor (-5% to +5%)
  const xOffset = -85 + (cursorProgress - 0.5) * 10; // This creates a subtle 10% total movement range

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, x: `${xOffset}%` }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: `${xOffset}%`
      }}
      transition={{ 
        x: { type: "spring", stiffness: 100, damping: 20 }
      }}
      exit={{ 
        scale: 0.8,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className="fixed left-1/2 top-[10%] w-full max-w-[330px] rounded-xl overflow-hidden shadow-xl z-50"
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-black">
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
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.type}</p>
      </div>
    </motion.div>
  );
}