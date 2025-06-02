
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '../components/theme-provider';
import Chat from '../components/conversation/Chat';
import Leaderboard from './Leaderboard';

const Conversation: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-display font-bold mb-4">Community</h1>
        
        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-full">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversation">
            <Chat />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Conversation;
