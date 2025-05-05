
import React from 'react';
import { Project } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../store/appStore';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { toast } from 'sonner';
import { formatCompactNumber } from '../../lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { updateProject, removeProject } = useAppStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  const editForm = useForm({
    defaultValues: {
      expectedAmount: project.expectedAmount || 0,
      points: project.points || 0,
      note: project.note || '',
    },
  });

  const onEditSubmit = (data: { expectedAmount: number; points: number; note: string }) => {
    updateProject(project.id, {
      expectedAmount: parseFloat(data.expectedAmount.toString()),
      points: parseFloat(data.points.toString()),
      note: data.note,
    });
    setIsEditDialogOpen(false);
    toast.success('Project stats updated');
  };

  const handleRemove = () => {
    removeProject(project.id);
    toast.success(`${project.name} removed from your projects`);
  };

  return (
    <div className="project-card flex justify-between">
      <div className="flex flex-col justify-between">
        <h3 className="font-semibold text-lg text-left">{project.name}</h3>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="text-sm">${formatCompactNumber(project.investedAmount || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expected</p>
            <p className="text-sm">${formatCompactNumber(project.expectedAmount || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Earned</p>
            <p className="text-sm">${formatCompactNumber(project.earnedAmount || 0)}</p>
          </div>
        </div>

        {project.points && project.points > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">Points: {formatCompactNumber(project.points)}</p>
          </div>
        )}

        {project.note && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Note:</p>
            <p className="text-xs">{project.note}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">Edit Stats</Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-accent/50">
              <DialogHeader>
                <DialogTitle className="font-display">Edit {project.name} Stats</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="expectedAmount">Expected Amount</Label>
                  <Input 
                    id="expectedAmount" 
                    type="number" 
                    className="bg-muted/50"
                    step="any"
                    {...editForm.register('expectedAmount')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="points">Points</Label>
                  <Input 
                    id="points" 
                    type="number" 
                    className="bg-muted/50"
                    step="any"
                    {...editForm.register('points')}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="note">Achievement/Note</Label>
                  <Textarea 
                    id="note" 
                    className="bg-muted/50"
                    placeholder="Enter achievements or notes here"
                    {...editForm.register('note')}
                  />
                </div>
                
                <Button type="submit" className="w-full btn-gradient">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
