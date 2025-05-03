
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mail, ExternalLink, FileText, UserCircle2, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatCompactNumber } from '../lib/utils';
import ProfileManager from '../components/profile/ProfileManager';
import { ScrollArea } from '@/components/ui/scroll-area';

const Support: React.FC = () => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [profileManagerOpen, setProfileManagerOpen] = useState(false);
  const [sharedData, setSharedData] = useState<{
    name: string;
    projects: any[];
  }>({ name: '', projects: [] });
  
  const [reviewDataInput, setReviewDataInput] = useState('');
  const [parsedData, setParsedData] = useState<{
    name: string;
    projects: Array<{
      name: string;
      investment?: number | string;
      expected?: number | string;
      earned?: number | string;
      stats?: Array<{ type: string, amount: number | string }>;
    }>;
  } | null>(null);

  // Handle shared data submission
  const handleReviewData = () => {
    try {
      // Simple parsing of shared data
      const lines = reviewDataInput.split('\n');
      let name = 'Someone';
      const projects: any[] = [];
      
      // Find name in the format "**Name's Projects**"
      const nameMatch = lines[0]?.match(/\*\*(.+?)'s Projects\*\*/);
      if (nameMatch && nameMatch[1]) {
        name = nameMatch[1];
      }
      
      let currentProject: any = null;
      
      lines.forEach(line => {
        // Check for project name line: "○ **ProjectName**"
        const projectMatch = line.match(/○\s*\*\*(.+?)\*\*/);
        if (projectMatch && projectMatch[1]) {
          // Save previous project if exists
          if (currentProject) {
            projects.push(currentProject);
          }
          // Start a new project
          currentProject = {
            name: projectMatch[1],
            stats: []
          };
        } 
        // Check for project details like "- *Investment: $1000*"
        else if (currentProject && line.match(/\-\s*\*/)) {
          // Investment match
          const investMatch = line.match(/Investment:\s*\$(.+?)\*/);
          if (investMatch && investMatch[1]) {
            currentProject.investment = investMatch[1];
          }
          
          // Earned match
          const earnedMatch = line.match(/Earned:\s*\$(.+?)\*/);
          if (earnedMatch && earnedMatch[1]) {
            currentProject.earned = earnedMatch[1];
          }
          
          // Expected match
          const expectedMatch = line.match(/Expected:\s*\$(.+?)\*/);
          if (expectedMatch && expectedMatch[1]) {
            currentProject.expected = expectedMatch[1];
          }
          
          // Stats match (format: "- *StatType: Value*")
          const statMatch = line.match(/\-\s*\*(.+?):\s*(.+?)\*/);
          if (statMatch && statMatch[1] && statMatch[2] && 
              !['Investment', 'Earned', 'Expected'].includes(statMatch[1])) {
            currentProject.stats.push({
              type: statMatch[1],
              amount: statMatch[2]
            });
          }
        }
      });
      
      // Add the last project if exists
      if (currentProject) {
        projects.push(currentProject);
      }
      
      // Update parsed data state
      setParsedData({
        name,
        projects
      });
      
      setSharedData({
        name,
        projects
      });
      
    } catch (error) {
      console.error('Error parsing data:', error);
      setParsedData(null);
    }
  };
  
  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 grid gap-6">
        {/* Profile Manager Button */}
        <Card className="glass-card relative overflow-hidden" onClick={() => setProfileManagerOpen(true)}>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Multi-Profile Manager</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage different profiles
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Open
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Review Data Card */}
        <Card className="glass-card" onClick={() => setReviewDialogOpen(true)}>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Review Shared Projects</h3>
                <p className="text-sm text-muted-foreground">
                  View project data shared by others
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Support Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Need Help?</CardTitle>
            <CardDescription>Contact the developer for assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
        
        {/* About Card */}
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
      
      {/* Review Data Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="glass-card border-accent/50 sm:max-w-lg max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-display">Review Shared Projects</DialogTitle>
            <DialogDescription>
              Paste shared project data to view and import
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="paste">Paste Data</TabsTrigger>
              <TabsTrigger value="view">View Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paste" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="shared-data">Paste Shared Project Data</Label>
                <Textarea 
                  id="shared-data"
                  placeholder="**User's Projects**
○ **Project1**
- *Investment: $1000*
- *Earned: $200*
..."
                  className="min-h-[200px] bg-muted/30"
                  value={reviewDataInput}
                  onChange={(e) => setReviewDataInput(e.target.value)}
                />
              </div>
              <Button onClick={handleReviewData} className="w-full btn-gradient">
                Parse Data
              </Button>
            </TabsContent>
            
            <TabsContent value="view" className="mt-4">
              {parsedData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg">
                    <div>
                      <h3 className="font-medium">{parsedData.name}'s Projects</h3>
                      <p className="text-xs text-muted-foreground">
                        {parsedData.projects.length} project(s)
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                      <Share className="h-3.5 w-3.5" />
                      <span>Import All</span>
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {parsedData.projects.map((project, index) => (
                        <div key={index} className="bg-muted/10 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{project.name}</h4>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Add to My Projects
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {project.investment !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Investment</p>
                                <p className="font-medium">${project.investment}</p>
                              </div>
                            )}
                            {project.earned !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Earned</p>
                                <p className="font-medium">${project.earned}</p>
                              </div>
                            )}
                            {project.expected !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Expected</p>
                                <p className="font-medium">${project.expected}</p>
                              </div>
                            )}
                          </div>
                          
                          {project.stats && project.stats.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Custom Stats:</p>
                              <div className="flex flex-wrap gap-1">
                                {project.stats.map((stat, idx) => (
                                  <div key={idx} className="bg-muted/20 text-xs px-2 py-0.5 rounded-full">
                                    {stat.type}: {stat.amount}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center p-8 bg-muted/20 rounded-lg">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <h3 className="font-medium mb-1">No Data Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste shared project data and click "Parse Data" to review
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => document.querySelector('[data-value="paste"]')?.click()}
                  >
                    Go to Paste Data
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Profile Manager Dialog */}
      <ProfileManager open={profileManagerOpen} onOpenChange={setProfileManagerOpen} />
    </div>
  );
};

export default Support;
