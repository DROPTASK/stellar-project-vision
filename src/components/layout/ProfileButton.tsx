
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle2 } from 'lucide-react';
import ProfileManager from '../profile/ProfileManager';

const ProfileButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <UserCircle2 className="h-5 w-5" />
      </Button>
      
      <ProfileManager open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default ProfileButton;
