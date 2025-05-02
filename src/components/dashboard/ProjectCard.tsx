
import React from 'react';
import { Project } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../store/appStore';
import { PlusCircle } from 'lucide-react';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { toast } from 'sonner';
import { formatCompactNumber } from '../../lib/utils';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { updateProject, addProjectStat } = useAppStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddStatsDialogOpen, setIsAddStatsDialogOpen] = React.useState(false);
  
  const editForm = useForm({
    defaultValues: {
      expectedAmount: project.expectedAmount || 0,
    },
  });

  const statsForm = useForm({
    defaultValues: {
      amount: 0,
      type: '',
    },
  });

  const onEditSubmit = (data: { expectedAmount: number }) => {
    updateProject(project.id, {
      expectedAmount: parseFloat(data.expectedAmount.toString()),
    });
    setIsEditDialogOpen(false);
    toast.success('Project stats updated');
  };

  const onAddStatSubmit = (data: { amount: number; type: string }) => {
    addProjectStat(project.id, {
      amount: parseFloat(data.amount.toString()),
      type: data.type
    });
    statsForm.reset();
    toast.success('Stat added to project');
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

        {project.stats && project.stats.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Custom Stats:</p>
            <div className="flex flex-wrap gap-1">
              {project.stats.map((stat, index) => (
                <div key={index} className="bg-muted/30 text-xs px-2 py-0.5 rounded-full">
                  {formatCompactNumber(stat.amount)} {stat.type}
                </div>
              ))}
            </div>
          </div>
        )}
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
        
        <div className="flex flex-col items-end gap-1">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">Edit Expected</Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-accent/50">
              <DialogHeader>
                <DialogTitle className="font-display">Edit {project.name} Expected Return</DialogTitle>
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
                
                <Button type="submit" className="w-full btn-gradient">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddStatsDialogOpen} onOpenChange={setIsAddStatsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <PlusCircle className="h-3 w-3 mr-1" />
                Add Stats
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-accent/50">
              <DialogHeader>
                <DialogTitle className="font-display">Add Stats to {project.name}</DialogTitle>
              </DialogHeader>
              
              <Form {...statsForm}>
                <form onSubmit={statsForm.handleSubmit(onAddStatSubmit)} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={statsForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="amount">Amount</Label>
                          <FormControl>
                            <Input 
                              id="amount" 
                              type="number" 
                              className="bg-muted/50"
                              step="any"
                              placeholder="98"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={statsForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="type">Type</Label>
                          <FormControl>
                            <Input 
                              id="type" 
                              type="text" 
                              className="bg-muted/50"
                              placeholder="days"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-muted/30 p-2 rounded-lg text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Examples:</p>
                    <ul className="space-y-1">
                      <li>• For Grass: amount 120, type days</li>
                      <li>• For Bless: amount 98, type days</li>
                      <li>• For Nexus: amount 45, type tasks</li>
                    </ul>
                  </div>
                  
                  <Button type="submit" className="w-full btn-gradient">Add Stat</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
