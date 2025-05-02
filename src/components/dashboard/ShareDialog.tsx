
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Share, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';
import { formatCompactNumber } from '../../lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DisplayOptions {
  investment: boolean;
  earning: boolean;
  expected: boolean;
  stats: boolean;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose }) => {
  const { projects } = useAppStore();
  const imageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    investment: true,
    earning: true,
    expected: true,
    stats: true,
  });
  
  // Initialize selected projects when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedProjects(projects.map(p => p.id));
    }
  }, [isOpen, projects]);
  
  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };
  
  const toggleDisplayOption = (option: keyof DisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Filter projects based on selection
  const filteredProjects = projects.filter(project => selectedProjects.includes(project.id));
  
  const handleDownload = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { 
          quality: 0.95,
          height: imageRef.current.scrollHeight,
          width: imageRef.current.scrollWidth,
          canvasHeight: imageRef.current.scrollHeight,
          canvasWidth: imageRef.current.scrollWidth,
          pixelRatio: 2,
          cacheBust: true, // Prevents caching issues
          skipAutoScale: true, // Prevents automatic scaling which can cause issues
          style: {
            backgroundColor: 'transparent',
          }
        });
        
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.download = 'my-crypto-projects.png';
        link.href = dataUrl;
        document.body.appendChild(link); // Needed for Firefox
        link.click();
        document.body.removeChild(link);
        
        toast.success('Image downloaded successfully');
      } catch (error) {
        console.error('Error generating image:', error);
        toast.error('Failed to generate image');
      }
    }
  };
  
  const handleShare = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { 
          quality: 0.95,
          height: imageRef.current.scrollHeight,
          width: imageRef.current.scrollWidth,
          canvasHeight: imageRef.current.scrollHeight,
          canvasWidth: imageRef.current.scrollWidth,
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: true,
          style: {
            backgroundColor: 'transparent',
          }
        });
        
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'my-crypto-projects.png', { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'My Crypto Projects',
            text: 'Hey! Have a look on my projects and to generate your same join @DropDeck1_bot!!'
          });
        } else {
          toast.error('Sharing not supported on this browser');
          // Fallback to download
          handleDownload();
        }
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share image');
      }
    }
  };

  const generateCopyText = () => {
    let text = "**My Projects**\n\n";
    
    filteredProjects.forEach(project => {
      text += `○ **${project.name}**\n`;
      
      if (displayOptions.investment) {
        text += `- *Invested: $${formatCompactNumber(project.investedAmount || 0)}*\n`;
      }
      
      if (displayOptions.earning) {
        text += `- *Earned: $${formatCompactNumber(project.earnedAmount || 0)}*\n`;
      }
      
      if (displayOptions.expected) {
        text += `- *Expected: $${formatCompactNumber(project.expectedAmount || 0)}*\n`;
      }
      
      if (displayOptions.stats && project.stats && project.stats.length > 0) {
        project.stats.forEach(stat => {
          text += `- *${stat.type}: ${formatCompactNumber(stat.amount)}*\n`;
        });
      }
      
      text += "\n";
    });
    
    text += "Hey! Have a look on my projects and to generate your join @DropDeck1_bot!!";
    
    return text;
  };
  
  const handleCopyText = () => {
    const text = generateCopyText();
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Text copied to clipboard'))
      .catch(() => toast.error('Failed to copy text'));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50 max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">Share My Projects</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Display Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Show Information</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem 
                checked={displayOptions.investment}
                onCheckedChange={() => toggleDisplayOption('investment')}
              >
                Investment
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={displayOptions.earning}
                onCheckedChange={() => toggleDisplayOption('earning')}
              >
                Earning
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={displayOptions.expected}
                onCheckedChange={() => toggleDisplayOption('expected')}
              >
                Expected
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={displayOptions.stats}
                onCheckedChange={() => toggleDisplayOption('stats')}
              >
                Custom Stats
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Select Projects</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              <DropdownMenuLabel>Choose Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {projects.map(project => (
                <DropdownMenuCheckboxItem 
                  key={project.id}
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={() => toggleProjectSelection(project.id)}
                >
                  {project.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div 
              ref={imageRef} 
              className="w-full p-4 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg"
            >
              <h2 className="text-xl font-display text-white text-center mb-4">My Projects</h2>
              
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {filteredProjects.map(project => (
                    <div key={project.id} className="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center">
                      <div className="w-full aspect-square mb-2 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        {project.logo ? (
                          <img 
                            src={project.logo} 
                            alt={`${project.name} logo`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-700">
                            {project.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-white text-sm text-center truncate w-full">{project.name}</h3>
                      
                      <div className="mt-1 flex flex-col items-center gap-1">
                        {displayOptions.investment && (
                          <div className="text-xs text-white/90">
                            Inv: ${formatCompactNumber(project.investedAmount || 0)}
                          </div>
                        )}
                        {displayOptions.earning && (
                          <div className="text-xs text-white/90">
                            Earned: ${formatCompactNumber(project.earnedAmount || 0)}
                          </div>
                        )}
                        {displayOptions.expected && (
                          <div className="text-xs text-white/90">
                            Exp: ${formatCompactNumber(project.expectedAmount || 0)}
                          </div>
                        )}
                        {displayOptions.stats && project.stats && project.stats.length > 0 && (
                          project.stats.map((stat, index) => (
                            <div key={index} className="text-xs text-white/90">
                              {stat.type}: {formatCompactNumber(stat.amount)}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white text-center">No projects selected</p>
              )}
              
              <div className="text-white text-xs text-center mt-4">
                Hey! Have a look on my projects and to generate your same join @DropDeck1_bot!!
              </div>
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button onClick={handleCopyText} className="flex-1" variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Text
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleShare} className="flex-1 btn-gradient">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
