
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Share } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  tags: string[];
  funding: string;
  reward: string;
  tge: string;
}

interface ProjectShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectShareDialog: React.FC<ProjectShareDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sharesCount, setSharesCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProjects();
      checkDailyShares();
    }
  }, [open]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('explore_projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDailyShares = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_project_shares')
        .select('share_count')
        .eq('user_id', user.id)
        .eq('shared_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSharesCount(data?.share_count || 0);
    } catch (error) {
      console.error('Error checking daily shares:', error);
    }
  };

  const shareProject = async (project: Project) => {
    if (!user || sharesCount >= 2 || isSharing) return;

    try {
      setIsSharing(true);
      const today = new Date().toISOString().split('T')[0];

      // Insert message - cast project as JSON to satisfy type requirements
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          username: user.username,
          content: `Shared project: ${project.name}`,
          message_type: 'project_share',
          project_data: project as any // Cast to satisfy JSON type
        });

      if (messageError) throw messageError;

      // Update share count
      const { error: shareError } = await supabase
        .from('user_project_shares')
        .upsert({
          user_id: user.id,
          shared_date: today,
          share_count: sharesCount + 1
        });

      if (shareError) throw shareError;

      // Award XP for sharing project
      await supabase.rpc('update_user_xp', {
        p_user_id: user.id,
        p_xp_gain: 20
      });

      setSharesCount(sharesCount + 1);
      toast({
        title: "Project Shared!",
        description: `You've shared ${project.name} and earned 20 XP!`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error sharing project:', error);
      toast({
        title: "Error",
        description: "Failed to share project",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Share Project</span>
            <Badge variant={sharesCount >= 2 ? "destructive" : "secondary"}>
              {sharesCount}/2 shares today
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {sharesCount >= 2 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You've reached your daily limit of 2 project shares. Come back tomorrow!
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={project.logo} 
                            alt={project.name}
                            className="h-10 w-10 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            {project.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {project.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.tags?.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => shareProject(project)}
                          disabled={isSharing}
                          size="sm"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectShareDialog;
