
import React from 'react';
import { useTheme } from '../theme-provider';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  valuePrefix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, valuePrefix = '$' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`metric-card ${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-full ${theme === "bright" ? "bg-black/10" : "bg-indigo-500/30"} mr-3`}>
          {icon}
        </div>
        <h3 className="text-muted-foreground font-medium text-sm">{title}</h3>
      </div>
      <p className={`${typeof value === 'number' && value > 0 ? 'dollar-amount' : 'text-2xl'} font-display font-bold tracking-wider`}>
        {typeof value === 'number' ? `${valuePrefix}${value.toLocaleString()}` : value}
      </p>
    </div>
  );
};

export default MetricCard;
