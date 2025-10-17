import React from 'react';
import { ProjectType } from '../types';

interface ProjectTypeBadgeProps {
  type: ProjectType;
}

const typeStyles: Record<ProjectType, string> = {
  [ProjectType.GraphicDesign]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  [ProjectType.VideoEditing]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
};

export const ProjectTypeBadge: React.FC<ProjectTypeBadgeProps> = ({ type }) => {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[type]} whitespace-nowrap`}>
      {type}
    </span>
  );
};
