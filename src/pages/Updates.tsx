
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '../components/theme-provider';
import { ExternalLink, MessageSquare } from 'lucide-react';

const Updates: React.FC = () => {
  const { theme } = useTheme();

  // This would come from the CMS in production
  const updates = [
    {
      id: 1,
      title: 'New Platform Features',
      image: '/placeholder.svg', 
      description: 'We\'ve added new features to help you track projects more efficiently. Check out the new dashboard layout and improved filtering options.',
      date: '2025-05-01'
    },
    {
      id: 2,
      title: 'Explore Tab Improvements',
      image: '/placeholder.svg',
      description: 'The Explore tab now shows more detailed information about each project, including funding status and reward potential.',
      date: '2025-04-15'
    }
  ];

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold">Updates</h1>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {updates.map((update) => (
              <Card 
                key={update.id} 
                className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="font-display">{update.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{new Date(update.date).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full h-48 rounded-lg overflow-hidden">
                    <img 
                      src={update.image} 
                      alt={update.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p>{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Support</h2>
            
            <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Contact Support</h3>
                </div>
                <p className="mb-4">
                  Need help with something? Our support team is available 24/7 to assist you with any questions or issues.
                </p>
                <div className="flex gap-2">
                  <Button variant={theme === "bright" ? "paper" : "outline"} className="w-full">
                    Email Support
                  </Button>
                  <Button variant="default" className="w-full">
                    Chat Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Resources</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center gap-1">
                      <span>Documentation</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center gap-1">
                      <span>FAQ</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center gap-1">
                      <span>Video Tutorials</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Updates;
