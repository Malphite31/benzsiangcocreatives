import React from 'react';
import { ProjectStatus } from '../types';

interface StatusBadgeProps {
  status: ProjectStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<ProjectStatus, string> = {
    [ProjectStatus.NotStarted]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [ProjectStatus.InProgress]: 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    [ProjectStatus.Revisions]: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    [ProjectStatus.Completed]: 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    [ProjectStatus.OnHold]: 'bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
    [ProjectStatus.Cancelled]: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]} whitespace-nowrap`}>
      {status}
    </span>
  );
};
