import React, { useMemo } from 'react';
import { Client, Project, ProjectStatus } from '../types';

interface AnalyticsGraphProps {
  projects: Project[];
  clients: Client[];
}

export const AnalyticsGraph: React.FC<AnalyticsGraphProps> = ({ projects, clients }) => {
  const chartData = useMemo(() => {
    const clientMap = new Map(clients.map(c => [c.id, c.name]));
    const earningsByClient: { [clientId: string]: number } = {};

    projects.forEach(p => {
      if (p.status === ProjectStatus.Completed) {
        if (!earningsByClient[p.clientId]) {
          earningsByClient[p.clientId] = 0;
        }
        earningsByClient[p.clientId] += p.budget;
      }
    });

    return Object.entries(earningsByClient)
      .map(([clientId, total]) => ({
        name: clientMap.get(clientId) || 'Unknown',
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [projects, clients]);

  if (chartData.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
            <p>No completed project data available to display analytics.</p>
        </div>
    );
  }

  const maxEarning = Math.max(...chartData.map(d => d.total), 0);
  const chartHeight = 240;
  const barWidth = 30;
  const chartPadding = 15;
  const labelAreaHeight = 50;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Earnings by Client</h3>
        <div className="overflow-x-auto">
            <svg width={chartData.length * (barWidth + chartPadding * 1.5) + chartPadding} height={chartHeight} aria-label="Earnings by client bar chart">
                <g>
                    {chartData.map((client, index) => {
                        const barHeight = client.total > 0 ? (client.total / maxEarning) * (chartHeight - labelAreaHeight - 20) : 0;
                        const x = index * (barWidth + chartPadding * 1.5) + chartPadding;
                        const y = chartHeight - barHeight - labelAreaHeight;

                        return (
                            <g key={client.name} className="bar-group">
                                <title>{`${client.name}: $${client.total.toLocaleString()}`}</title>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="#3b82f6"
                                    className="hover:opacity-80 transition-opacity"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 5}
                                    textAnchor="middle"
                                    fontSize="12"
                                    className="fill-gray-800 dark:fill-gray-200"
                                    fontWeight="600"
                                >
                                    ${client.total.toLocaleString()}
                                </text>
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight - labelAreaHeight + 20}
                                    textAnchor="middle"
                                    fontSize="12"
                                    className="fill-gray-600 dark:fill-gray-400"
                                >
                                    {client.name}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    </div>
  );
};