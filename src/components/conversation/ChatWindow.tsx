
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Smile, Paperclip } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string | null;
  created_at: string;
  is_anonymous: boolean;
  message_type: string | null;
}

interface Conversation {
  id: string;
  name: string | null;
  type: string;
  is_anonymous: boolean;
}

interface ChatWindowProps {
  conversation: Conversation;
  onUserClick: (userId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onUserClick }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      
      // For default channels, use the conversation ID directly
      const conversationId = ['updates', 'community', 'anonymous'].includes(conversation.id) 
        ? conversation.id 
        : conversation.id;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const conversationId = ['updates', 'community', 'anonymous'].includes(conversation.id) 
      ? conversation.id 
      : conversation.id;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return;

    try {
      setIsSending(true);
      
      const conversationId = ['updates', 'community', 'anonymous'].includes(conversation.id) 
        ? conversation.id 
        : conversation.id;

      // Check if this is a restricted channel
      if (conversation.id === 'updates' && user.role !== 'Admin') {
        toast({
          title: "Access Denied",
          description: "Only admins can send messages to DropDeck Updates",
          variant: "destructive",
        });
        return;
      }

      const messageData = {
        conversation_id: conversationId,
        user_id: conversation.is_anonymous ? null : user.id,
        username: conversation.is_anonymous ? 'Anonymous' : user.username,
        content: newMessage,
        is_anonymous: conversation.is_anonymous,
        message_type: 'text',
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

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

  const getMessageBubbleClass = (message: Message) => {
    const isOwn = message.user_id === user?.id;
    const baseClass = "max-w-[70%] p-3 rounded-2xl break-words";
    
    if (isOwn) {
      return `${baseClass} bg-primary text-primary-foreground ml-auto`;
    } else {
      return `${baseClass} bg-muted`;
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  if (isLoading) {
    return (
      <div className="glass-card flex items-center justify-center h-full">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {conversation.type === 'channel' ? '#' : 
           conversation.type === 'group' ? '👥' : '💬'}
        </div>
        <div>
          <h3 className="font-semibold">{conversation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.type === 'channel' ? 'Channel' : 
             conversation.is_anonymous ? 'Anonymous Chat' : 'Group Chat'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                {message.user_id !== user?.id && !message.is_anonymous && (
                  <Avatar 
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => message.user_id && onUserClick(message.user_id)}
                  >
                    <AvatarFallback>
                      {message.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={getMessageBubbleClass(message)}>
                  {message.user_id !== user?.id && (
                    <div className="text-xs font-medium mb-1 opacity-70">
                      {message.username}
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    message.user_id === user?.id ? 'text-right' : 'text-left'
                  }`}>
                    {formatMessageTime(message.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                conversation.id === 'updates' && user?.role !== 'Admin'
                  ? "Only admins can send messages here"
                  : "Type a message..."
              }
              disabled={conversation.id === 'updates' && user?.role !== 'Admin'}
              className="pr-20 rounded-full"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isSending || (conversation.id === 'updates' && user?.role !== 'Admin')}
            size="sm"
            className="rounded-full h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
