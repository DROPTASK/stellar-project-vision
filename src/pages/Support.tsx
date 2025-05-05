
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mail, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Support: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Need Help?</CardTitle>
            <CardDescription>Contact the developer for assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Join Telegram Community</h3>
                <p className="text-sm text-muted-foreground">@cryptoairdrops_07</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto"
                onClick={() => window.open('https://t.me/cryptoairdrops_07', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Telegram</h3>
                <p className="text-sm text-muted-foreground">@milkyway_king</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto"
                onClick={() => window.open('https://t.me/milkyway_king', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">vanshadd001@gmail.com</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto"
                onClick={() => window.location.href = 'mailto:vanshadd001@gmail.com'}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="font-display">About</CardTitle>
            <CardDescription>Crypto Project Tracker</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This application allows you to track your crypto investments and projects in one place.
              Add projects, record investments and earnings, and explore new opportunities.
            </p>
            <div className="flex justify-center mt-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 animate-pulse-glow flex items-center justify-center">
                <span className="font-display text-xl">CP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
