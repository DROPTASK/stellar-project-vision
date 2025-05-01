
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../store/appStore';
import { Switch } from '@/components/ui/switch';

interface AddProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  logoUrl: string;
  amount: string;
  type: string;
  isTestnet: boolean;
}

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ isOpen, onClose }) => {
  const { addProject } = useAppStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount) || 0;
    
    addProject({
      name: data.name,
      logo: data.logoUrl || undefined,
      investedAmount: amount,
      type: data.type || undefined,
      isTestnet: data.isTestnet,
    });
    
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              className="bg-muted/50"
              {...register('name', { required: "Project name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input 
              id="logoUrl" 
              className="bg-muted/50"
              placeholder="https://example.com/logo.png"
              {...register('logoUrl')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              step="any"
              className="bg-muted/50"
              placeholder="0.00"
              {...register('amount')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Project Type</Label>
            <Input 
              id="type" 
              className="bg-muted/50"
              placeholder="DeFi, Gaming, etc."
              {...register('type')}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Switch id="isTestnet" {...register('isTestnet')} />
            <Label htmlFor="isTestnet">This is a testnet project</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="btn-gradient">Add Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
