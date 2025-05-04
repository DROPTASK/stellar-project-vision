
import React, { useState } from 'react';
import { Project } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../store/appStore';
import { PlusCircle, Edit, X, Trash2 } from 'lucide-react';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GridProjectCardProps {
  project: Project;
}

const GridProjectCard: React.FC<GridProjectCardProps> = ({ project }) => {
  const { updateProject, addProjectStat, removeProjectStat, updateProjectStat } = useAppStore();
  const [isAddStatsDialogOpen, setIsAddStatsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  
  const statsForm = useForm({
    defaultValues: {
      amount: 0,
      type: '',
    },
  });

  const editForm = useForm({
    defaultValues: {
      investedAmount: project.investedAmount || 0,
      expectedAmount: project.expectedAmount || 0,
      earnedAmount: project.earnedAmount || 0,
    },
  });

  const onAddStatSubmit = (data: { amount: number; type: string }) => {
    if (editingStatIndex !== null && project.stats) {
      // Update existing stat
      updateProjectStat(project.id, editingStatIndex, {
        amount: parseFloat(data.amount.toString()),
        type: data.type
      });
      setEditingStatIndex(null);
      toast.success('Stat updated');
    } else {
      // Add new stat
      addProjectStat(project.id, {
        amount: parseFloat(data.amount.toString()),
        type: data.type
      });
      toast.success('Stat added to project');
    }
    statsForm.reset();
  };

  const onEditSubmit = (data: { investedAmount: number; expectedAmount: number; earnedAmount: number }) => {
    updateProject(project.id, {
      investedAmount: parseFloat(data.investedAmount.toString()),
      expectedAmount: parseFloat(data.expectedAmount.toString()),
      earnedAmount: parseFloat(data.earnedAmount.toString()),
    });
    setIsEditDialogOpen(false);
    toast.success('Project stats updated');
  };
  
  // Function to edit a stat
  const editStat = (statIndex: number) => {
    if (!project.stats) return;
    
    const stat = project.stats[statIndex];
    statsForm.setValue('amount', stat.amount);
    statsForm.setValue('type', stat.type);
    setEditingStatIndex(statIndex);
  };
  
  // Function to remove a stat
  const removeStat = (statIndex: number) => {
    removeProjectStat(project.id, statIndex);
    toast.success('Stat removed successfully');
    
    // If we were editing this stat, reset the form
    if (editingStatIndex === statIndex) {
      setEditingStatIndex(null);
      statsForm.reset();
    }
  };

  return (
    <div className="glass-card p-4 flex flex-col blue-glow transition-all">
      <h3 className="font-semibold text-base mb-3 truncate">{project.name}</h3>
      
      <div className="w-full aspect-square mb-3 rounded-full overflow-hidden bg-muted flex-shrink-0"> {/* Changed to rounded-full for circular logo */}
        {project.logo ? (
          <img 
            src={project.logo} 
            alt={`${project.name} logo`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary text-2xl font-semibold">
            {project.name.charAt(0)}
          </div>
        )}
      </div>
      
      {project.stats && project.stats.length > 0 ? (
        <div className="flex-1">
          <div className="flex flex-wrap gap-1 mb-3">
            {project.stats.map((stat, index) => (
              <div key={index} className="bg-muted/30 text-xs px-2 py-0.5 rounded-full">
                {stat.amount} {stat.type}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-2">No custom stats yet</p>
        </div>
      )}

      <div className="flex flex-col gap-1 mt-2">
        <Dialog open={isAddStatsDialogOpen} onOpenChange={setIsAddStatsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full">
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-accent/50">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingStatIndex !== null ? 'Edit Stat' : 'Add Stats to'} {project.name}
              </DialogTitle>
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
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                
                {project.stats && project.stats.length > 0 && (
                  <div className="mt-4">
                    <Label>Current Stats</Label>
                    <ScrollArea className="h-[120px] mt-2">
                      <div className="space-y-2">
                        {project.stats.map((stat, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm font-medium">{stat.amount} {stat.type}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0" 
                              onClick={() => editStat(index)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-destructive" 
                              onClick={() => removeStat(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                
                <div className="bg-muted/30 p-2 rounded-lg text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Examples:</p>
                  <ul className="space-y-1">
                    <li>• For Grass: amount 120, type days</li>
                    <li>• For Bless: amount 98, type days</li>
                    <li>• For Nexus: amount 45, type tasks</li>
                  </ul>
                </div>
                
                <Button type="submit" className="w-full btn-gradient">
                  {editingStatIndex !== null ? 'Update Stat' : 'Add Stat'}
                </Button>
                
                {editingStatIndex !== null && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      setEditingStatIndex(null);
                      statsForm.reset();
                    }}
                  >
                    Cancel Editing
                  </Button>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="h-3 w-3 mr-1" />
              Edit Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-accent/50">
            <DialogHeader>
              <DialogTitle className="font-display">Edit {project.name}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="investedAmount">Invested Amount</Label>
                <Input 
                  id="investedAmount" 
                  type="number" 
                  className="bg-muted/50"
                  step="any"
                  {...editForm.register('investedAmount')}
                />
              </div>
              
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
                <Label htmlFor="earnedAmount">Earned Amount</Label>
                <Input 
                  id="earnedAmount" 
                  type="number" 
                  className="bg-muted/50"
                  step="any"
                  {...editForm.register('earnedAmount')}
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

export default GridProjectCard;
