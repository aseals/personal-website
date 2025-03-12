import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectViewerProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectViewer({ project, onClose }: ProjectViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card w-full max-w-[375px] rounded-xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full aspect-[9/16] object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
