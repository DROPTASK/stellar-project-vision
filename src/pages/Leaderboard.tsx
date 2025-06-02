
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '../components/theme-provider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
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
        .select('id, username, total_earnings, total_investment')
        .order('total_earnings', { ascending: false })
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-display font-bold mb-4">Leaderboard</h1>
          <div className="flex items-center justify-center h-64">
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-display font-bold mb-4">Leaderboard</h1>
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading leaderboard. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-display font-bold mb-4">Top Earners</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <Card key={entry.id} className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(index + 1)}
                        <div>
                          <h3 className="font-semibold">{entry.username}</h3>
                          <p className="text-sm text-muted-foreground">
                            Investment: ${Number(entry.total_investment).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${Number(entry.total_earnings).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users with earnings yet. Be the first!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Leaderboard;
