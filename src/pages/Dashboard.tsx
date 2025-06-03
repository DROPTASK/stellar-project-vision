
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MessageSquare, CheckSquare, TrendingUp, DollarSign } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/contexts/AuthContext';
import GridProjectCard from '@/components/dashboard/GridProjectCard';
import MetricCard from '@/components/dashboard/MetricCard';
import AddProjectDialog from '@/components/dashboard/AddProjectDialog';
import TodoSection from '@/components/dashboard/TodoSection';
import { useTheme } from '@/components/theme-provider';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { projects, getTotalInvestment, getTotalEarning, getExpectedReturn } = useAppStore();
  const [isAddProjectOpen, setIsAddProjectOpen] = React.useState(false);

  const totalInvestment = getTotalInvestment();
  const totalEarning = getTotalEarning();
  const expectedReturn = getExpectedReturn();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section with Logo */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/42bbad58-2214-4745-ad42-9fff506985d7.png" 
            alt="DropDeck Logo" 
            className="h-16 w-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.username || 'User'}!</h1>
          <p className="text-muted-foreground">Track your crypto investments and manage your portfolio</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setIsAddProjectOpen(true)}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm">Add Project</span>
        </Button>
        
        <Button
          onClick={() => navigate('/conversation')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-sm">Community</span>
        </Button>
        
        <Button
          onClick={() => navigate('/investment')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <TrendingUp className="h-6 w-6" />
          <span className="text-sm">Investments</span>
        </Button>
        
        <Button
          onClick={() => navigate('/explore')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <DollarSign className="h-6 w-6" />
          <span className="text-sm">Explore</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Investment"
          value={`$${totalInvestment.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="+12%"
        />
        <MetricCard
          title="Total Earnings"
          value={`$${totalEarning.toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+8%"
        />
        <MetricCard
          title="Expected Returns"
          value={`$${expectedReturn.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="+15%"
        />
      </div>

      {/* Recent Projects */}
      <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/investment')}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects yet. Add your first project to get started!</p>
              <Button
                onClick={() => setIsAddProjectOpen(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => (
                <GridProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Todo Section */}
      <TodoSection />

      <AddProjectDialog
        open={isAddProjectOpen}
        onOpenChange={setIsAddProjectOpen}
      />
    </div>
  );
};

export default Dashboard;
