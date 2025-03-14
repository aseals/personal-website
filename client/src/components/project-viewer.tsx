import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@shared/schema";
import { useState } from "react";

interface ProjectViewerProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectViewer({ project, onClose }: ProjectViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card w-full max-w-[390px] rounded-xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-black">
          <div className="aspect-[9/16] relative">
            {!isPlaying ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsPlaying(true)}
              />
            ) : (
              <video
                src={project.videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                controls
                playsInline
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 rounded-full p-2 z-10"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900">
          <h3 className="font-medium text-lg">{project.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{project.type}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}