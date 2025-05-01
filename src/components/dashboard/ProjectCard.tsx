
import React from 'react';
import { Project } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../store/appStore';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { updateProject } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      investedAmount: project.investedAmount || 0,
      expectedAmount: project.expectedAmount || 0,
      earnedAmount: project.earnedAmount || 0,
    },
  });

  const onSubmit = (data: { investedAmount: number; expectedAmount: number; earnedAmount: number }) => {
    updateProject(project.id, {
      investedAmount: parseFloat(data.investedAmount.toString()),
      expectedAmount: parseFloat(data.expectedAmount.toString()),
      earnedAmount: parseFloat(data.earnedAmount.toString()),
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="project-card flex justify-between">
      <div className="flex flex-col justify-between">
        <h3 className="font-semibold text-lg text-left">{project.name}</h3>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="text-sm">${project.investedAmount?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expected</p>
            <p className="text-sm">${project.expectedAmount?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Earned</p>
            <p className="text-sm">${project.earnedAmount?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">Edit Stats</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-accent/50">
            <DialogHeader>
              <DialogTitle className="font-display">Edit {project.name}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="investedAmount">Invested Amount</Label>
                <Input 
                  id="investedAmount" 
                  type="number" 
                  className="bg-muted/50"
                  step="any"
                  {...register('investedAmount')}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expectedAmount">Expected Amount</Label>
                <Input 
                  id="expectedAmount" 
                  type="number" 
                  className="bg-muted/50"
                  step="any"
                  {...register('expectedAmount')}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="earnedAmount">Earned Amount</Label>
                <Input 
                  id="earnedAmount" 
                  type="number" 
                  className="bg-muted/50"
                  step="any"
                  {...register('earnedAmount')}
                />
              </div>
              
              <Button type="submit" className="w-full btn-gradient">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectCard;
