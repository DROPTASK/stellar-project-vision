
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  username: string;
  name: string | null;
  profile_picture: string | null;
  role: string;
  level: number;
  xp: number;
}

interface UserSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (userId: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ open, onOpenChange, onUserSelect }) => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    if (open) {
      loadRecentUsers();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadRecentUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, name, profile_picture, role, level, xp')
        .neq('id', currentUser?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentUsers(data || []);
    } catch (error) {
      console.error('Error loading recent users:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, name, profile_picture, role, level, xp')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', currentUser?.id)
        .limit(20);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    onUserSelect(userId);
  };

  const displayUsers = searchQuery.trim() ? searchResults : recentUsers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="pl-10"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">
              {searchQuery.trim() ? 'Search Results' : 'Recent Users'}
            </h3>
            
            <ScrollArea className="max-h-96">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Searching...</div>
                </div>
              ) : displayUsers.length > 0 ? (
                <div className="space-y-2">
                  {displayUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profile_picture || ''} />
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{user.name || user.username}</p>
                            <Badge variant="outline" className="text-xs">
                              Lv.{user.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery.trim() ? 'No users found' : 'No recent users'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearch;
