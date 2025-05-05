
import React from 'react';
import { ExploreProject } from '../../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProjectDetail from './ProjectDetail';
import { useTheme } from '../theme-provider';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: ExploreProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { theme } = useTheme();
  
  return (
    <div className="project-card">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`tag ${
                  tag === 'hot' ? 'tag-hot' : 
                  tag === 'potential' ? 'tag-potential' : 
                  tag === 's2' || tag === 's5' ? `tag-${tag}` :
                  tag === 'huge' ? 'tag-huge' :
                  tag === 'soon' ? 'tag-soon' :
                  'bg-gray-500/70 text-white'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
          {project.logo ? (
            <img 
              src={project.logo} 
              alt={`${project.name} logo`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
              {project.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-sm grid grid-cols-3 gap-x-2">
        <div>
          <p className="text-xs text-muted-foreground">Funding</p>
          <p>{project.funding || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Reward</p>
          <p>{project.reward || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">TGE</p>
          <p>{project.tge || 'N/A'}</p>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-xs text-muted-foreground mb-1">Description</p>
        <p className="text-sm line-clamp-2">{project.description || 'No description available'}</p>
      </div>
      
      <div className="mt-4 flex justify-end items-center gap-2">
        {project.joinUrl && (
          <a 
            href={project.joinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="default" 
              className="bg-primary"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Join
            </Button>
          </a>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant={theme === "bright" ? "paper" : "outline"}
              size="sm" 
            >
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className={`glass-card ${theme === "bright" ? "border-black/40" : "border-accent/50"} max-h-[90vh]`}>
            <DialogHeader>
              <DialogTitle className="font-display">{project.name}</DialogTitle>
            </DialogHeader>
            <ProjectDetail project={project} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectCard;
