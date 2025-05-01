
import React, { useState } from 'react';
import { ExploreProject } from '../../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '../../store/appStore';
import { toast } from 'sonner';

interface SimpleProjectCardProps {
  project: ExploreProject;
}

const SimpleProjectCard: React.FC<SimpleProjectCardProps> = ({ project }) => {
  const { addProjectFromExplore } = useAppStore();
  const [investedAmount, setInvestedAmount] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddToMyProjects = () => {
    addProjectFromExplore(project.id, {
      investedAmount: parseFloat(investedAmount) || 0,
      expectedAmount: parseFloat(expectedAmount) || 0,
    });
    
    toast.success(`${project.name} added to your projects`);
    setInvestedAmount("");
    setExpectedAmount("");
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <div className="glass-card flex justify-between p-3 mb-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted mr-3">
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
            <h3 className="font-medium">{project.name}</h3>
            <div className="flex gap-1 mt-0.5">
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="self-center"
          onClick={() => setIsDialogOpen(true)}
        >
          Add
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-accent/50">
          <DialogHeader>
            <DialogTitle className="font-display">Add {project.name}</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center mt-4">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted mr-4">
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
              <h3 className="font-medium text-lg">{project.name}</h3>
              <div className="flex gap-1 mt-0.5">
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddToMyProjects} className="btn-gradient">
                Add Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimpleProjectCard;
