
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users, MessageSquare } from 'lucide-react';
import { useTheme } from '../components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ConversationList from '../components/conversation/ConversationList';
import ChatWindow from '../components/conversation/ChatWindow';
import UserSearch from '../components/conversation/UserSearch';
import UserProfile from '../components/conversation/UserProfile';
import CreateGroupDialog from '../components/conversation/CreateGroupDialog';

interface Conversation {
  id: string;
  name: string | null;
  type: string;
  is_anonymous: boolean;
  last_message?: string;
  last_message_time?: string;
  other_user?: any;
}

const Conversation: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
      joinDefaultChannels();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Get user's conversations
      const { data: userConversations, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            name,
            type,
            is_anonymous,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Format conversations and add default channels
      const formattedConversations: Conversation[] = [];
      
      // Add default channels first
      const defaultChannels = [
        { id: 'updates', name: 'DropDeck Updates', type: 'channel', is_anonymous: false },
        { id: 'community', name: 'Community Chat', type: 'group', is_anonymous: false },
        { id: 'anonymous', name: 'Anonymous Chat', type: 'group', is_anonymous: true },
      ];
      
      formattedConversations.push(...defaultChannels);

      // Add user conversations
      if (userConversations) {
        for (const uc of userConversations) {
          if (uc.conversations && !defaultChannels.find(dc => dc.id === uc.conversations.id)) {
            formattedConversations.push({
              id: uc.conversations.id,
              name: uc.conversations.name,
              type: uc.conversations.type,
              is_anonymous: uc.conversations.is_anonymous,
            });
          }
        }
      }

      setConversations(formattedConversations);
      
      // Auto-select community chat
      const communityChat = formattedConversations.find(c => c.id === 'community');
      if (communityChat) {
        setSelectedConversation(communityChat);
      }

    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinDefaultChannels = async () => {
    if (!user) return;

    try {
      // Auto-join user to default channels
      const defaultChannelIds = ['updates', 'community', 'anonymous'];
      
      for (const channelId of defaultChannelIds) {
        await supabase
          .from('conversation_participants')
          .upsert({
            conversation_id: channelId,
            user_id: user.id,
          }, { onConflict: 'conversation_id,user_id' });
      }
    } catch (error) {
      console.error('Error joining default channels:', error);
    }
  };

  const handleUserSelect = (userId: string) => {
    setShowUserProfile(userId);
    setShowUserSearch(false);
  };

  const handleStartDM = async (userId: string) => {
    // Create or find existing DM conversation
    try {
      // Check if DM already exists
      const { data: existing, error: existingError } = await supabase
        .from('conversations')
        .select('*')
        .eq('type', 'dm')
        .single();

      if (existingError && existingError.code !== 'PGRST116') throw existingError;

      let conversationId;
      
      if (existing) {
        conversationId = existing.id;
      } else {
        // Create new DM conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            type: 'dm',
            created_by: user?.id,
          })
          .select()
          .single();

        if (createError) throw createError;
        conversationId = newConv.id;

        // Add participants
        await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: user?.id },
            { conversation_id: conversationId, user_id: userId },
          ]);
      }

      // Reload conversations and select the DM
      await loadConversations();
      const dmConversation = conversations.find(c => c.id === conversationId);
      if (dmConversation) {
        setSelectedConversation(dmConversation);
      }
      
      setShowUserProfile(null);
    } catch (error) {
      console.error('Error starting DM:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to access messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold">Messages</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowUserSearch(true)}>
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowCreateGroup(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <div className="md:col-span-1">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              isLoading={isLoading}
            />
          </div>
          
          {/* Chat Window */}
          <div className="md:col-span-2">
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onUserClick={handleUserSelect}
              />
            ) : (
              <div className="flex items-center justify-center h-full glass-card">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Search Dialog */}
      <UserSearch
        open={showUserSearch}
        onOpenChange={setShowUserSearch}
        onUserSelect={handleUserSelect}
      />

      {/* User Profile Dialog */}
      {showUserProfile && (
        <UserProfile
          userId={showUserProfile}
          open={!!showUserProfile}
          onOpenChange={() => setShowUserProfile(null)}
          onStartDM={handleStartDM}
        />
      )}

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
        onGroupCreated={loadConversations}
      />
    </div>
  );
};

export default Conversation;
