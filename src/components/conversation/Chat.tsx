
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../../components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, Share, X } from 'lucide-react';
import ProjectShareDialog from './ProjectShareDialog';

interface Message {
  id: string;
  user_id: string | null;
  username: string;
  content: string;
  message_type: string;
  project_data: any;
  created_at: string;
}

const Chat: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showProjectShare, setShowProjectShare] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return;

    try {
      setIsSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert([{
          user_id: user.id,
          username: user.username,
          content: newMessage.trim(),
          message_type: 'text'
        }]);

      if (error) throw error;

      // Award XP for sending message
      await supabase.rpc('update_user_xp', {
        p_user_id: user.id,
        p_xp_gain: 5
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return (
      <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please log in to join the conversation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Community Chat</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProjectShare(true)}
            >
              <Share className="h-4 w-4 mr-2" />
              Share Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] mb-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{message.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.created_at)}
                        </span>
                        {message.message_type === 'project_share' && (
                          <Badge variant="secondary" className="text-xs">
                            Project Share
                          </Badge>
                        )}
                      </div>
                      
                      {message.message_type === 'project_share' && message.project_data ? (
                        <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={message.project_data.logo} 
                              alt={message.project_data.name}
                              className="h-8 w-8 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                            <div>
                              <h4 className="font-semibold">{message.project_data.name}</h4>
                              {message.project_data.description && (
                                <p className="text-sm text-muted-foreground">
                                  {message.project_data.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm mt-1">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isSending}
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProjectShareDialog 
        open={showProjectShare}
        onOpenChange={setShowProjectShare}
      />
    </div>
  );
};

export default Chat;
