
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  return (
    <div className="metric-card">
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-full bg-indigo-500/30 mr-3">
          {icon}
        </div>
        <h3 className="text-muted-foreground font-medium text-sm">{title}</h3>
      </div>
      <p className="text-2xl font-display font-semibold tracking-wider">
        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
      </p>
    </div>
  );
};

export default MetricCard;
