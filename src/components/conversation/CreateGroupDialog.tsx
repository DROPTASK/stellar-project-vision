
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ open, onOpenChange, onGroupCreated }) => {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !user) return;

    try {
      setIsCreating(true);
      
      // Create the conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          name: groupName,
          type: 'group',
          is_anonymous: isAnonymous,
          created_by: user.id,
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add creator as participant
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversation.id,
          user_id: user.id,
        });

      if (participantError) throw participantError;

      toast({
        title: "Group Created",
        description: `${groupName} has been created successfully`,
      });

      onGroupCreated();
      onOpenChange(false);
      setGroupName('');
      setIsAnonymous(false);
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            />
            <Label htmlFor="anonymous">Anonymous group (hide member identities)</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGroup} 
              disabled={!groupName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
