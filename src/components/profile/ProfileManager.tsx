
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle2, Plus, Trash2, Edit2, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isActive: boolean;
}

interface ProfileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LOCAL_STORAGE_KEY = 'crypto-tracking-profiles';

const ProfileManager: React.FC<ProfileManagerProps> = ({ open, onOpenChange }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newProfile, setNewProfile] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Load profiles from localStorage on component mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      // Create default profile if none exists
      const defaultProfile: Profile = {
        id: 'default',
        name: 'Default Profile',
        description: 'Main profile',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      setProfiles([defaultProfile]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([defaultProfile]));
    }
  }, []);
  
  // Update localStorage whenever profiles change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
    }
  }, [profiles]);
  
  const handleAddProfile = () => {
    if (!newProfile.name.trim()) {
      toast.error('Profile name is required');
      return;
    }
    
    const newProfileData: Profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      description: newProfile.description,
      createdAt: new Date().toISOString(),
      isActive: false
    };
    
    setProfiles(prev => [...prev, newProfileData]);
    setNewProfile({ name: '', description: '' });
    toast.success('Profile added successfully');
  };
  
  const handleDeleteProfile = (id: string) => {
    // Prevent deleting the active profile
    const profileToDelete = profiles.find(p => p.id === id);
    if (profileToDelete?.isActive) {
      toast.error('Cannot delete active profile');
      return;
    }
    
    setProfiles(prev => prev.filter(profile => profile.id !== id));
    toast.success('Profile deleted');
  };
  
  const handleSwitchProfile = (id: string) => {
    // Save current app state with current profile ID
    const currentActiveProfile = profiles.find(p => p.isActive);
    if (currentActiveProfile) {
      const currentAppState = localStorage.getItem('crypto-tracking-app');
      if (currentAppState) {
        localStorage.setItem(`crypto-tracking-app-${currentActiveProfile.id}`, currentAppState);
      }
    }
    
    // Set the new profile as active
    setProfiles(prev => prev.map(profile => ({
      ...profile,
      isActive: profile.id === id
    })));
    
    // Load the app state for the new profile
    const profileAppState = localStorage.getItem(`crypto-tracking-app-${id}`);
    if (profileAppState) {
      localStorage.setItem('crypto-tracking-app', profileAppState);
    } else {
      // If no state exists for this profile, create a fresh state
      const emptyState = JSON.stringify({
        state: {
          projects: [],
          transactions: [],
          exploreProjects: [], // This will be populated from the exploreCatalog
          todos: []
        }
      });
      localStorage.setItem('crypto-tracking-app', emptyState);
    }
    
    toast.success('Profile switched. Reload the app to see changes.');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  const handleEditProfile = (profile: Profile) => {
    setNewProfile({ name: profile.name, description: profile.description || '' });
    setEditingId(profile.id);
  };
  
  const handleSaveEdit = () => {
    if (!newProfile.name.trim() || !editingId) return;
    
    setProfiles(prev => prev.map(profile => 
      profile.id === editingId 
        ? { ...profile, name: newProfile.name, description: newProfile.description }
        : profile
    ));
    
    setNewProfile({ name: '', description: '' });
    setEditingId(null);
    toast.success('Profile updated');
  };
  
  const handleCancelEdit = () => {
    setNewProfile({ name: '', description: '' });
    setEditingId(null);
  };
  
  const activeProfile = profiles.find(p => p.isActive);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-accent/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Profile Manager</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <UserCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{activeProfile?.name || 'Default Profile'}</p>
              <p className="text-xs text-muted-foreground">{activeProfile?.description || 'Main profile'}</p>
            </div>
          </div>
          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full">Active</span>
        </div>
        
        <div className="space-y-4">
          {editingId ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="edit-name">Profile Name</Label>
                <Input 
                  id="edit-name" 
                  value={newProfile.name}
                  onChange={e => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-muted/30 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input 
                  id="edit-description" 
                  value={newProfile.description}
                  onChange={e => setNewProfile(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-muted/30 mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="profile-name">New Profile Name</Label>
                <Input 
                  id="profile-name" 
                  value={newProfile.name}
                  onChange={e => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-muted/30 mt-1"
                  placeholder="Enter profile name"
                />
              </div>
              <div>
                <Label htmlFor="profile-description">Description (Optional)</Label>
                <Input 
                  id="profile-description" 
                  value={newProfile.description}
                  onChange={e => setNewProfile(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-muted/30 mt-1"
                  placeholder="Enter description"
                />
              </div>
              <Button onClick={handleAddProfile} className="w-full btn-gradient">
                <Plus className="mr-2 h-4 w-4" />
                Add Profile
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">All Profiles</Label>
          <ScrollArea className="h-60 rounded-md border border-muted/20">
            <div className="p-2 space-y-2">
              {profiles.map(profile => (
                <div 
                  key={profile.id} 
                  className={`p-2 rounded-lg flex items-center justify-between ${
                    profile.isActive ? 'bg-accent/20' : 'bg-muted/10 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center mr-2">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{profile.name}</p>
                      {profile.description && (
                        <p className="text-xs text-muted-foreground">{profile.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!profile.isActive && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleEditProfile(profile)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive" 
                          onClick={() => handleDeleteProfile(profile.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    {!profile.isActive && (
                      <Button 
                        variant="ghost"
                        size="icon" 
                        className="h-7 w-7 text-primary" 
                        onClick={() => handleSwitchProfile(profile.id)}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileManager;
