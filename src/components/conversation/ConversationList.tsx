
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Hash, Users, Globe } from 'lucide-react';

interface Conversation {
  id: string;
  name: string | null;
  type: string;
  is_anonymous: boolean;
  last_message?: string;
  last_message_time?: string;
  other_user?: any;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  isLoading
}) => {
  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === 'channel') {
      return <Hash className="h-4 w-4" />;
    } else if (conversation.type === 'group') {
      return conversation.is_anonymous ? <Globe className="h-4 w-4" /> : <Users className="h-4 w-4" />;
    } else {
      return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.other_user) return conversation.other_user.username;
    return `${conversation.type} conversation`;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/50 ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {conversation.type === 'dm' && conversation.other_user ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.other_user.profile_picture || ''} />
                      <AvatarFallback>
                        {conversation.other_user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getConversationIcon(conversation)}
                    </div>
                  )}
                  
                  {conversation.is_anonymous && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Globe className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {getConversationName(conversation)}
                    </p>
                    {conversation.type === 'channel' && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Channel
                      </Badge>
                    )}
                  </div>
                  
                  {conversation.last_message && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.last_message}
                    </p>
                  )}
                  
                  {!conversation.last_message && (
                    <p className="text-xs text-muted-foreground">
                      {conversation.type === 'channel' ? 'Official updates' : 
                       conversation.is_anonymous ? 'Anonymous chat' : 'No messages yet'}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
