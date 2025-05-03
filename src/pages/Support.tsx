
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mail, ExternalLink, Database, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProjectReview from '../components/support/ProjectReview';

const Support: React.FC = () => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isReviewingProject, setIsReviewingProject] = useState(false);
  const [projectData, setProjectData] = useState<string>('');
  const navigate = useNavigate();
  
  const handleAdminAccess = () => {
    if (adminPassword === '9084996719') {
      toast.success('Admin access granted');
      setIsAdminModalOpen(false);
      navigate('/admin');
    } else {
      toast.error('Incorrect password');
    }
  };
  
  const handlePasteProjectData = () => {
    try {
      navigator.clipboard.readText().then(text => {
        setProjectData(text);
        if (text) {
          toast.success('Data pasted successfully');
        } else {
          toast.error('No data found in clipboard');
        }
      });
    } catch (error) {
      toast.error('Failed to access clipboard');
    }
  };
  
  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Need Help?</CardTitle>
            <CardDescription>Contact the developer for assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Telegram</h3>
                <p className="text-sm text-muted-foreground">@milkyway_king</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto"
                onClick={() => window.open('https://t.me/milkyway_king', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">vanshadd001@gmail.com</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto"
                onClick={() => {
                  const mailLink = document.createElement('a');
                  mailLink.href = 'mailto:vanshadd001@gmail.com';
                  mailLink.target = '_blank';
                  document.body.appendChild(mailLink);
                  mailLink.click();
                  document.body.removeChild(mailLink);
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="font-display">Review Shared Projects</CardTitle>
            <CardDescription>View projects shared by others</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Paste project data shared by others to view their projects and statistics.
            </p>
            
            <div className="flex gap-2 mb-4">
              <Button onClick={handlePasteProjectData} className="flex-1">
                Paste From Clipboard
              </Button>
              <Button 
                onClick={() => setIsReviewingProject(true)} 
                disabled={!projectData} 
                className="flex-1"
                variant="outline"
              >
                View Projects
              </Button>
            </div>
            
            <Input
              placeholder="Or paste project data here..."
              value={projectData}
              onChange={(e) => setProjectData(e.target.value)}
              className="mb-2"
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="font-display">About</CardTitle>
            <CardDescription>Crypto Project Tracker</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This application allows you to track your crypto investments and projects in one place.
              Add projects, record investments and earnings, and explore new opportunities.
            </p>
            <div className="flex justify-center mt-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 animate-pulse-glow flex items-center justify-center">
                <span className="font-display text-xl">CP</span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-6 mx-auto flex items-center"
              onClick={() => setIsAdminModalOpen(true)}
            >
              <Lock className="h-3 w-3 mr-1" /> 
              Admin Access
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Password Modal */}
      <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
        <DialogContent className="glass-card border-accent/50">
          <DialogHeader>
            <DialogTitle className="font-display">Admin Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter admin password to access content management system.
            </p>
            <Input
              type="password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
            />
            <Button 
              className="w-full" 
              onClick={handleAdminAccess}
            >
              Access Admin Panel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Project Review Dialog */}
      <ProjectReview 
        isOpen={isReviewingProject} 
        onClose={() => setIsReviewingProject(false)}
        projectData={projectData}
      />
    </div>
  );
};

export default Support;
