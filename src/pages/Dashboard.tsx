
import React, { useState } from 'react';
import { LayoutDashboard, WalletCards, Briefcase, TrendingUp, PlusCircle, Share2 } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../store/appStore';
import ProjectCard from '../components/dashboard/ProjectCard';
import AddProjectDialog from '../components/dashboard/AddProjectDialog';
import ShareDialog from '../components/dashboard/ShareDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard: React.FC = () => {
  const { projects, getTotalInvestment, getTotalEarning, getExpectedReturn } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const totalProjects = projects.length;
  const totalInvestment = getTotalInvestment();
  const totalEarning = getTotalEarning();
  const expectedReturn = getExpectedReturn();

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard 
          title="Total Earning" 
          value={totalEarning} 
          icon={<WalletCards className="h-5 w-5 text-green-400" />} 
        />
        <MetricCard 
          title="Total Investment" 
          value={totalInvestment} 
          icon={<Briefcase className="h-5 w-5 text-blue-400" />} 
        />
        <MetricCard 
          title="Total Projects" 
          value={totalProjects} 
          icon={<LayoutDashboard className="h-5 w-5 text-purple-400" />} 
        />
        <MetricCard 
          title="Expected Return" 
          value={expectedReturn} 
          icon={<TrendingUp className="h-5 w-5 text-amber-400" />} 
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Actions</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="btn-gradient h-auto py-3"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Project
        </Button>
        <Button 
          onClick={() => setIsShareDialogOpen(true)}
          variant="outline" 
          className="h-auto py-3 backdrop-blur-sm"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4 mt-6">
        <h2 className="text-xl font-semibold">My Projects</h2>
        <span className="text-sm text-muted-foreground">{totalProjects} Projects</span>
      </div>
      
      <ScrollArea className="h-[calc(100vh-380px)]">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-muted-foreground">No projects added yet</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              variant="link" 
              className="mt-2"
            >
              Add your first project
            </Button>
          </div>
        )}
      </ScrollArea>
      
      <AddProjectDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />
      
      <ShareDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
