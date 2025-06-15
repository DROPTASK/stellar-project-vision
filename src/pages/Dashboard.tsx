
import React from 'react';
import { useAppStore } from '../store/appStore';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '../hooks/use-mobile';
import { PieChart, Code, Coins, Rocket } from 'lucide-react';

// --- Restore original MetricCard and Grid layout with simple styles ---
const Dashboard: React.FC = () => {
  const { projects, getTotalInvestment, getTotalEarning, getExpectedReturn } = useAppStore();
  const isMobile = useIsMobile();

  const totalInvestment = getTotalInvestment();
  const totalEarning = getTotalEarning();
  const expectedReturn = getExpectedReturn();

  // Card for top metrics
  const MetricCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({
    title,
    value,
    icon,
  }) => (
    <Card className="flex flex-col items-center justify-center p-4 rounded-xl border bg-white/60 dark:bg-black/50">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">{icon}</div>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );

  // Simple grid card like originally
  const GridProjectCard: React.FC<{ project: any }> = ({ project }) => (
    <Link to={`/project/${project.id}`}>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md overflow-hidden bg-muted">
            {project.logo ? (
              <img src={project.logo} alt={`${project.name} logo`} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                {project.name.charAt(0)}
              </div>
            )}
          </div>
          <h3 className="font-semibold">{project.name}</h3>
        </div>
        <div className="text-sm text-muted-foreground">Invested: ${project.investedAmount || 0}</div>
        <Progress value={((project.earnedAmount || 0) / (project.expectedAmount || 1)) * 100} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Earned: ${project.earnedAmount || 0}</span>
          <span>Expected: ${project.expectedAmount || 0}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 pb-24">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-lg sm:text-xl">Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard title="Total Investment" value={totalInvestment} icon={<Coins size={20} />} />
          <MetricCard title="Total Earnings" value={totalEarning} icon={<PieChart size={20} />} />
          <MetricCard title="Expected Return" value={expectedReturn} icon={<Rocket size={20} />} />
        </CardContent>
      </Card>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Link to="/investment" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-360px)]">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="rounded-xl transition-transform duration-150 hover:scale-[1.04] shadow-lg border-2 border-primary/10 bg-white/30 dark:bg-black/40"
                >
                  <GridProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border rounded-lg bg-white/60 dark:bg-black/40">
              <p className="text-muted-foreground">No projects added yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Go to <Link to="/explore" className="text-primary hover:underline">Explore</Link> to add
                projects
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;
