
import React, { useState } from 'react';
import { ExploreProject } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '../../store/appStore';
import { toast } from 'sonner';
import { PlusCircle, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectDetailProps {
  project: ExploreProject;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const { addProjectFromExplore } = useAppStore();
  const [investedAmount, setInvestedAmount] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToMyProjects = () => {
    addProjectFromExplore(project.id, {
      investedAmount: parseFloat(investedAmount) || 0,
      expectedAmount: parseFloat(expectedAmount) || 0,
    });
    
    toast.success(`${project.name} added to your projects`);
    setInvestedAmount("");
    setExpectedAmount("");
    setIsAdding(false);
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-4 mt-4">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted mr-4">
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
          
          <div>
            <h2 className="text-xl font-semibold">{project.name}</h2>
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
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Funding</p>
            <p className="font-medium">{project.funding || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reward</p>
            <p className="font-medium">{project.reward || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">TGE</p>
            <p className="font-medium">{project.tge || 'N/A'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{project.description || 'No description available'}</p>
        </div>
        
        {project.hydraLink && (
          <div className="mt-2">
            <a 
              href={project.hydraLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline text-sm"
            >
              <ExternalLink size={14} className="mr-1" />
              View in Hydra Channel
            </a>
          </div>
        )}
        
        {!isAdding ? (
          <Button 
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 btn-gradient"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to My Projects
          </Button>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="investedAmount">Invested Amount</Label>
              <Input 
                id="investedAmount" 
                type="number" 
                step="any"
                className="bg-muted/50"
                placeholder="0.00"
                value={investedAmount}
                onChange={(e) => setInvestedAmount(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expectedAmount">Expected Amount</Label>
              <Input 
                id="expectedAmount" 
                type="number" 
                step="any"
                className="bg-muted/50"
                placeholder="0.00"
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddToMyProjects} className="btn-gradient">
                Add Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ProjectDetail;
