
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAppStore } from '../../store/appStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const ProfileModal: React.FC = () => {
  const { isProfileModalOpen, hideProfileModal, addProfile } = useAppStore();
  const [formData, setFormData] = React.useState({
    name: '',
    walletAddress: '',
    email: '',
    socialAccount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    const newProfile = {
      id: uuidv4(),
      name: formData.name,
      walletAddress: formData.walletAddress,
      email: formData.email,
      socialAccount: formData.socialAccount,
      createdAt: new Date().toISOString()
    };
    
    addProfile(newProfile);
    toast.success(`Profile "${formData.name}" has been created!`);
    hideProfileModal();
    setFormData({
      name: '',
      walletAddress: '',
      email: '',
      socialAccount: ''
    });
  };

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={hideProfileModal}>
      <DialogContent className="glass-card border-accent/50">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Profile</DialogTitle>
          <DialogDescription>
            Add a new profile to manage separate project collections
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter profile name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address (Optional)</Label>
            <Input
              id="walletAddress"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="Enter your wallet address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="socialAccount">Social Account (Optional)</Label>
            <Input
              id="socialAccount"
              name="socialAccount"
              value={formData.socialAccount}
              onChange={handleChange}
              placeholder="Enter your social account"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={hideProfileModal}>
              Cancel
            </Button>
            <Button type="submit">
              Create Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
