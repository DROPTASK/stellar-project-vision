
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '../components/theme-provider';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define a type for our update items
interface UpdateItem {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  date: string;
}

const Updates: React.FC = () => {
  const { theme } = useTheme();

  // Fetch updates from Supabase
  const { data: updates = [], isLoading, error } = useQuery({
    queryKey: ['updates'],
    queryFn: async () => {
      console.log('Fetching updates from Supabase...');
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching updates:', error);
        throw error;
      }

      console.log('Fetched updates:', data);
      return data as UpdateItem[];
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-display font-bold mb-4">Updates</h1>
          <div className="flex items-center justify-center h-64">
            <p>Loading updates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-display font-bold mb-4">Updates</h1>
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading updates. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold">Updates</h1>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {updates.length > 0 ? (
              updates.map((update) => (
                <Card 
                  key={update.id} 
                  className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}
                >
                  <CardHeader>
                    <CardTitle className="font-display">{update.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(update.date).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {update.image && (
                      <div className="w-full h-48 rounded-lg overflow-hidden">
                        <img 
                          src={update.image} 
                          alt={update.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    )}
                    <p>{update.description || 'No description available'}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No updates available yet.</p>
              </div>
            )}
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
