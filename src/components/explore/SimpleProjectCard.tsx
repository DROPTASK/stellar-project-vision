
import React, { useState } from 'react';
import { ExploreProject } from '../../types';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../../store/appStore';
import { PlusCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SimpleProjectCardProps {
  project: ExploreProject;
}

const SimpleProjectCard: React.FC<SimpleProjectCardProps> = ({ project }) => {
  const { addProjectFromExplore } = useAppStore();
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const handleAddProject = () => {
    addProjectFromExplore(project.id, {});
    toast.success(`${project.name} added to your projects`);
  };

  const renderTags = () => {
    if (!project.tags || project.tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {project.tags.map((tag, index) => (
          <span 
            key={index} 
            className={`tag ${tag === 'hot' ? 'tag-hot' : tag === 'potential' ? 'tag-potential' : tag === 's2' || tag === 's5' ? 'tag-s2' : tag === 'huge' ? 'tag-huge' : tag === 'soon' ? 'tag-soon' : ''}`}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center p-3 glass-card my-2">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full overflow-hidden bg-muted/30 flex-shrink-0">
            {project.logo ? (
              <img 
                src={project.logo} 
                alt={`${project.name} logo`} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-primary">
                {project.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="ml-3">
            <p className="font-semibold text-sm">{project.name}</p>
            {renderTags()}
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="text-xs h-8 px-1 sm:px-2"
            onClick={() => setIsDetailDialogOpen(true)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
          
          <Button 
            onClick={handleAddProject}
            size="sm" 
            className="btn-gradient text-xs h-8 px-1 sm:px-2"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="glass-card border-accent/50">
          <DialogHeader>
            <DialogTitle className="font-display">{project.name} Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 p-4 bg-muted/20 rounded-lg">
            <p className="text-center text-muted-foreground">
              No detailed data available [will be available soon]
            </p>
            <Button 
              className="w-full mt-4 btn-gradient" 
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimpleProjectCard;
