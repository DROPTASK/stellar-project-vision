
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../components/theme-provider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, Star } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  name: string | null;
  profile_picture: string | null;
  level: number;
  xp: number;
  role: string;
  total_earnings: number;
  total_investment: number;
}

const Leaderboard: React.FC = () => {
  const { theme } = useTheme();

  const { data: leaderboard = [], isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, name, profile_picture, level, xp, role, total_earnings, total_investment')
        .order('level', { ascending: false })
        .order('xp', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as LeaderboardEntry[];
    }
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="h-6 w-6 flex items-center justify-center font-bold text-muted-foreground">#{rank}</span>;
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-500';
    if (level >= 5) return 'text-blue-500';
    if (level >= 3) return 'text-green-500';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading leaderboard. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Top Players by Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <Card key={entry.id} className={`${theme === "bright" ? "border border-black/20" : "border"} ${index < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-background border">
                              {entry.profile_picture ? (
                                <img 
                                  src={entry.profile_picture} 
                                  alt={entry.name || entry.username} 
                                  className="object-cover h-full w-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full bg-primary/10">
                                  <span className="text-sm font-semibold">
                                    {(entry.name || entry.username).charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">{entry.name || entry.username}</h3>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-muted-foreground">@{entry.username}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {entry.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className={`h-4 w-4 ${getLevelColor(entry.level)}`} />
                            <span className={`font-bold text-lg ${getLevelColor(entry.level)}`}>
                              Level {entry.level}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {entry.xp} XP
                          </p>
                          <div className="text-xs text-muted-foreground mt-1">
                            <div>Earned: ${Number(entry.total_earnings).toFixed(2)}</div>
                            <div>Invested: ${Number(entry.total_investment).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No players found. Be the first to level up!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
        <CardHeader>
          <CardTitle>XP Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Send Message</span>
              <Badge variant="outline">+5 XP</Badge>
            </div>
            <div className="flex justify-between">
              <span>Share Project</span>
              <Badge variant="outline">+20 XP</Badge>
            </div>
            <div className="flex justify-between">
              <span>$1000 Earnings</span>
              <Badge variant="outline">+100 XP</Badge>
            </div>
            <div className="flex justify-between">
              <span>$100 Investment</span>
              <Badge variant="outline">+100 XP</Badge>
            </div>
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Level Up Requirement</span>
                <Badge>100 XP</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
