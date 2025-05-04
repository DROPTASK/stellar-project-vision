
import React, { useState } from 'react';
import { Project } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../store/appStore';
import { Edit, Trash2 } from 'lucide-react';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { toast } from 'sonner';
import { useTheme } from '../theme-provider';

interface GridProjectCardProps {
  project: Project;
}

const GridProjectCard: React.FC<GridProjectCardProps> = ({ project }) => {
  const { updateProject, updateProjectStat, removeProjectStat } = useAppStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  
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
      points: project.points || 0,
      note: project.note || '',
    },
  });

  const onEditStatSubmit = (data: { amount: number; type: string }) => {
    if (editingStatIndex !== null) {
      // Don't add empty stats
      if (data.type.trim() === '' || data.amount === 0) {
        // If empty, remove the stat
        removeProjectStat(project.id, editingStatIndex);
        toast.success('Stat removed');
      } else {
        // Update existing stat
        updateProjectStat(project.id, editingStatIndex, {
          amount: parseFloat(data.amount.toString()),
          type: data.type
        });
        toast.success('Stat updated');
      }
      setEditingStatIndex(null);
    }
    statsForm.reset();
  };

  const onEditSubmit = (data: { 
    investedAmount: number; 
    expectedAmount: number; 
    earnedAmount: number; 
    points: number;
    note: string;
  }) => {
    updateProject(project.id, {
      investedAmount: parseFloat(data.investedAmount.toString()),
      expectedAmount: parseFloat(data.expectedAmount.toString()),
      earnedAmount: parseFloat(data.earnedAmount.toString()),
      points: parseFloat(data.points.toString()),
      note: data.note,
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

  const cardClass = theme === 'bright' 
    ? 'bg-gradient-to-br from-anime-soft-blue/60 to-anime-soft-purple/40 p-3 flex flex-col rounded-2xl border border-anime-soft-purple/30 shadow-sm transition-all animate-fade-in'
    : 'glass-card p-3 flex flex-col blue-glow transition-all';

  return (
    <div className={cardClass} style={{ maxWidth: '100%', minHeight: '180px' }}>
      <h3 className="font-semibold text-sm mb-2 truncate">{project.name}</h3>
      
      <div className="w-full aspect-square mb-3 rounded-full overflow-hidden bg-muted flex-shrink-0" style={{ maxHeight: '50px', maxWidth: '50px', margin: '0 auto' }}> 
        {project.logo ? (
          <img 
            src={project.logo} 
            alt={`${project.name} logo`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary text-lg font-semibold">
            {project.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-1 text-center">
          <div className="text-xs text-muted-foreground">Invested</div>
          <div className="text-xs font-medium">${project.investedAmount || 0}</div>
          
          <div className="text-xs text-muted-foreground">Expected</div>
          <div className="text-xs font-medium">${project.expectedAmount || 0}</div>
          
          <div className="text-xs text-muted-foreground">Earned</div>
          <div className="text-xs font-medium">${project.earnedAmount || 0}</div>
          
          <div className="text-xs text-muted-foreground">Points</div>
          <div className="text-xs font-medium">{project.points || 0}</div>
        </div>
        
        {project.note && (
          <div className="mt-2 text-xs text-center text-muted-foreground bg-muted/20 rounded p-1">
            {project.note}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <Dialog open={editingStatIndex !== null} onOpenChange={(open) => {
          if (!open) {
            setEditingStatIndex(null);
            statsForm.reset();
          }
        }}>
          <DialogContent className={theme === 'bright' ? 'bg-white border-anime-soft-purple/50 rounded-xl' : 'glass-card border-accent/50'}>
            <DialogHeader>
              <DialogTitle className="font-display">
                Edit Stat for {project.name}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...statsForm}>
              <form onSubmit={statsForm.handleSubmit(onEditStatSubmit)} className="space-y-4 mt-4">
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
                            className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
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
                            className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
                            placeholder="days"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className={`flex-1 ${theme === 'bright' ? 'bg-anime-vivid-purple hover:bg-anime-magenta-pink' : 'btn-gradient'}`}
                  >
                    Update
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="flex-1" 
                    onClick={() => {
                      if (editingStatIndex !== null) {
                        removeStat(editingStatIndex);
                        setEditingStatIndex(null);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className={`w-full text-xs ${theme === 'bright' ? 'bg-anime-vivid-purple hover:bg-anime-magenta-pink text-white' : ''}`}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit Stats
            </Button>
          </DialogTrigger>
          <DialogContent className={theme === 'bright' ? 'bg-white border-anime-soft-purple/50 rounded-xl' : 'glass-card border-accent/50'}>
            <DialogHeader>
              <DialogTitle className="font-display">Edit {project.name}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="investedAmount">Invested Amount</Label>
                  <Input 
                    id="investedAmount" 
                    type="number" 
                    className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
                    step="any"
                    {...editForm.register('investedAmount')}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="earnedAmount">Earned Amount</Label>
                  <Input 
                    id="earnedAmount" 
                    type="number" 
                    className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
                    step="any"
                    {...editForm.register('earnedAmount')}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="expectedAmount">Expected Amount</Label>
                  <Input 
                    id="expectedAmount" 
                    type="number" 
                    className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
                    step="any"
                    {...editForm.register('expectedAmount')}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="points">Points</Label>
                  <Input 
                    id="points" 
                    type="number" 
                    className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
                    step="any"
                    {...editForm.register('points')}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="note">Note / Achievement</Label>
                <Input 
                  id="note" 
                  type="text" 
                  className={theme === 'bright' ? 'bg-anime-soft-gray/50 border-anime-soft-purple/30' : 'bg-muted/50'}
                  placeholder="Any achievement or note"
                  {...editForm.register('note')}
                />
              </div>
              
              <Button 
                type="submit" 
                className={`w-full ${theme === 'bright' ? 'bg-anime-vivid-purple hover:bg-anime-magenta-pink' : 'btn-gradient'}`}
              >
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GridProjectCard;
