
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Trophy, DollarSign, TrendingUp, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileData {
  id: string;
  username: string;
  name: string | null;
  profile_picture: string | null;
  description: string | null;
  role: string;
  level: number;
  xp: number;
  total_earnings: number;
  total_investment: number;
  is_profile_public: boolean;
  show_investments: boolean;
  show_earnings: boolean;
  social_x: string | null;
  social_discord: string | null;
  social_telegram: string | null;
}

interface UserProject {
  id: string;
  name: string;
  logo: string | null;
  invested_amount: number;
  earned_amount: number;
  expected_amount: number;
  points: number;
}

interface UserProfileProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartDM: (userId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, open, onOpenChange, onStartDM }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && userId) {
      loadUserProfile();
      loadUserProjects();
    }
  }, [open, userId]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('user_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading user projects:', error);
    }
  };

  const handleStartDM = () => {
    onStartDM(userId);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse">Loading profile...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <div className="flex items-center justify-center h-64">
            <p>User not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const canViewInvestments = profile.show_investments || userId === currentUser?.id;
  const canViewEarnings = profile.show_earnings || userId === currentUser?.id;
  const canViewProfile = profile.is_profile_public || userId === currentUser?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Profile Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profile_picture || ''} />
                  <AvatarFallback>
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name || profile.username}</h2>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{profile.role}</Badge>
                    <Badge variant="outline">Level {profile.level}</Badge>
                  </div>
                </div>
              </div>
              
              {userId !== currentUser?.id && (
                <Button onClick={handleStartDM}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>

            {/* Description */}
            {profile.description && (
              <div>
                <p className="text-sm">{profile.description}</p>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Level & XP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Level {profile.level}</div>
                  <div className="text-sm text-muted-foreground">{profile.xp} XP</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Stats */}
            {canViewProfile && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Investment
                      {!canViewInvestments && <Lock className="h-3 w-3 ml-1" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {canViewInvestments ? (
                      <>
                        <div className="text-2xl font-bold">${Number(profile.total_investment).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total Invested</div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Private</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Earnings
                      {!canViewEarnings && <Lock className="h-3 w-3 ml-1" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {canViewEarnings ? (
                      <>
                        <div className="text-2xl font-bold">${Number(profile.total_earnings).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total Earned</div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Private</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Projects */}
            {canViewProfile && projects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Projects</h3>
                <div className="grid grid-cols-1 gap-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.logo || ''} />
                        <AvatarFallback>
                          {project.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{project.name}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {canViewInvestments && (
                            <span>Invested: ${project.invested_amount}</span>
                          )}
                          {canViewEarnings && (
                            <span>Earned: ${project.earned_amount}</span>
                          )}
                          <span>{project.points} pts</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {projects.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{projects.length - 5} more projects
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(profile.social_x || profile.social_discord || profile.social_telegram) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Social Links</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.social_x && (
                    <Badge variant="outline">X: {profile.social_x}</Badge>
                  )}
                  {profile.social_discord && (
                    <Badge variant="outline">Discord: {profile.social_discord}</Badge>
                  )}
                  {profile.social_telegram && (
                    <Badge variant="outline">Telegram: {profile.social_telegram}</Badge>
                  )}
                </div>
              </div>
            )}

            {!canViewProfile && (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">This profile is private</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
