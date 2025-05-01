
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '../../store/appStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionType: "investment" | "earning";
}

interface FormValues {
  projectId: string;
  customProjectName: string;
  customProjectLogo: string;
  amount: string;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ 
  isOpen, 
  onClose, 
  transactionType 
}) => {
  const { projects, addTransaction, addProject } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isCustomProject, setIsCustomProject] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedProject("");
      setIsCustomProject(false);
    }
  }, [isOpen, reset]);

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setIsCustomProject(value === "custom");
  };

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount);
    
    if (!amount || isNaN(amount)) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (isCustomProject) {
      if (!data.customProjectName) {
        toast.error('Please enter a project name');
        return;
      }
      
      // Create new project first
      const newProject = {
        name: data.customProjectName,
        logo: data.customProjectLogo || undefined,
        investedAmount: transactionType === 'investment' ? amount : 0,
        earnedAmount: transactionType === 'earning' ? amount : 0,
      };
      
      const newProjectId = addProject(newProject);
      
      addTransaction({
        projectId: newProjectId,
        projectName: newProject.name,
        projectLogo: newProject.logo,
        amount,
        type: transactionType,
      });
    } else {
      // Add transaction for existing project
      const project = projects.find(p => p.id === data.projectId);
      
      if (project) {
        addTransaction({
          projectId: project.id,
          projectName: project.name,
          projectLogo: project.logo,
          amount,
          type: transactionType,
        });
      }
    }
    
    reset();
    onClose();
    toast.success(`${transactionType === 'investment' ? 'Investment' : 'Earning'} added successfully`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50">
        <DialogHeader>
          <DialogTitle className="font-display">
            Add {transactionType === "investment" ? "Investment" : "Earning"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="project">Select Project</Label>
            <Select value={selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Add Custom Project</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <input 
              type="hidden" 
              {...register('projectId')} 
              value={selectedProject === "custom" ? "" : selectedProject} 
            />
          </div>
          
          {isCustomProject && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="customProjectName">Custom Project Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="customProjectName" 
                  className="bg-muted/50"
                  {...register('customProjectName')}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="customProjectLogo">Custom Project Logo URL</Label>
                <Input 
                  id="customProjectLogo" 
                  className="bg-muted/50"
                  placeholder="https://example.com/logo.png"
                  {...register('customProjectLogo')}
                />
              </div>
            </>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
            <Input 
              id="amount" 
              type="number" 
              step="any"
              className="bg-muted/50"
              placeholder="0.00"
              {...register('amount', { required: true })}
            />
            {errors.amount && <p className="text-red-500 text-xs">Amount is required</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              className={transactionType === "investment" ? "btn-gradient" : "bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:opacity-90"}
              disabled={(!selectedProject && !isCustomProject) || (selectedProject === "custom" && !isCustomProject)}
            >
              Add {transactionType === "investment" ? "Investment" : "Earning"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
