
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '../components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Trophy, Star, Shield } from 'lucide-react';

interface ProfileData {
  id: string;
  username: string;
  name: string | null;
  profile_picture: string | null;
  description: string | null;
  social_x: string | null;
  social_discord: string | null;
  social_telegram: string | null;
  xp: number;
  level: number;
  role: string;
  total_earnings: number;
  total_investment: number;
  is_profile_public: boolean;
  show_investments: boolean;
  show_earnings: boolean;
}

const Profile: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          profile_picture: profile.profile_picture,
          description: profile.description,
          social_x: profile.social_x,
          social_discord: profile.social_discord,
          social_telegram: profile.social_telegram,
          is_profile_public: profile.is_profile_public,
          show_investments: profile.show_investments,
          show_earnings: profile.show_earnings,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6 flex items-center justify-center h-64">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6 flex items-center justify-center h-64">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-bold">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info Card */}
          <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profile_picture || ''} />
                  <AvatarFallback>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{profile.name || profile.username}</h3>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  <Badge variant="secondary" className="mt-1">
                    {profile.role}
                  </Badge>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profile_picture">Profile Picture URL</Label>
                    <Input
                      id="profile_picture"
                      value={profile.profile_picture || ''}
                      onChange={(e) => setProfile({...profile, profile_picture: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      placeholder="Your display name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={profile.description || ''}
                      onChange={(e) => setProfile({...profile, description: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {profile.description && (
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Stats & Level</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{profile.xp}</div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    ${Number(profile.total_earnings).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    ${Number(profile.total_investment).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Investment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                </div>
                <Switch
                  checked={profile.is_profile_public}
                  onCheckedChange={(checked) => setProfile({...profile, is_profile_public: checked})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Investments</Label>
                  <p className="text-sm text-muted-foreground">Display investment amounts</p>
                </div>
                <Switch
                  checked={profile.show_investments}
                  onCheckedChange={(checked) => setProfile({...profile, show_investments: checked})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Earnings</Label>
                  <p className="text-sm text-muted-foreground">Display earning amounts</p>
                </div>
                <Switch
                  checked={profile.show_earnings}
                  onCheckedChange={(checked) => setProfile({...profile, show_earnings: checked})}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="social_x">X (Twitter)</Label>
                    <Input
                      id="social_x"
                      value={profile.social_x || ''}
                      onChange={(e) => setProfile({...profile, social_x: e.target.value})}
                      placeholder="@username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="social_discord">Discord</Label>
                    <Input
                      id="social_discord"
                      value={profile.social_discord || ''}
                      onChange={(e) => setProfile({...profile, social_discord: e.target.value})}
                      placeholder="username#1234"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="social_telegram">Telegram</Label>
                    <Input
                      id="social_telegram"
                      value={profile.social_telegram || ''}
                      onChange={(e) => setProfile({...profile, social_telegram: e.target.value})}
                      placeholder="@username"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {profile.social_x && (
                    <Badge variant="outline">
                      X: {profile.social_x}
                    </Badge>
                  )}
                  {profile.social_discord && (
                    <Badge variant="outline">
                      Discord: {profile.social_discord}
                    </Badge>
                  )}
                  {profile.social_telegram && (
                    <Badge variant="outline">
                      Telegram: {profile.social_telegram}
                    </Badge>
                  )}
                  {!profile.social_x && !profile.social_discord && !profile.social_telegram && (
                    <p className="text-sm text-muted-foreground">No social links added yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
