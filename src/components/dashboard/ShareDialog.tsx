
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Share, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';
import { formatCompactNumber } from '../../lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = isMobile ? 8 : 9; // Show 8 on mobile, 3×3 grid on desktop
  
  // Dropdown state to prevent auto-closing
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  
  // Initialize selected projects when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedProjects(projects.map(p => p.id));
      setCurrentPage(1); // Reset to first page when opening
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
    // Don't close dropdown when toggling selection
    return false;
  };
  
  const toggleDisplayOption = (option: keyof DisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Filter projects based on selection
  const filteredProjects = projects.filter(project => selectedProjects.includes(project.id));
  
  // Get current page projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
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
        text += `- *Investment: $${formatCompactNumber(project.investedAmount || 0)}*\n`;
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
    
    text += "Hey! Have a look on my projects and to generate your same join @DropDeck1_bot!!";
    
    return text;
  };
  
  const handleCopyText = () => {
    const text = generateCopyText();
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Text copied to clipboard'))
      .catch(() => toast.error('Failed to copy text'));
  };

  // Define responsive grid columns based on screen size
  const getGridColumns = () => {
    if (isMobile) {
      return filteredProjects.length === 1 ? 'grid-cols-1' : 
             filteredProjects.length <= 2 ? 'grid-cols-2' : 
             'grid-cols-2 sm:grid-cols-3';
    }
    return 'grid-cols-3';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50 max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">Share My Projects</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <DropdownMenu open={optionsDropdownOpen} onOpenChange={setOptionsDropdownOpen}>
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
          
          <DropdownMenu open={projectsDropdownOpen} onOpenChange={setProjectsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Select Projects</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60">
              <ScrollArea className="h-60 pr-4">
                <DropdownMenuLabel>Choose Projects</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {projects.map(project => (
                  <DropdownMenuCheckboxItem 
                    key={project.id}
                    checked={selectedProjects.includes(project.id)}
                    onSelect={(e) => {
                      e.preventDefault(); // Prevent default to avoid closing
                      toggleProjectSelection(project.id);
                    }}
                  >
                    {project.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
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
              
              {currentProjects.length > 0 ? (
                <div className={`grid ${getGridColumns()} gap-3`}>
                  {currentProjects.map(project => (
                    <div 
                      key={project.id} 
                      className="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center" 
                      style={{ 
                        aspectRatio: '1/1', 
                        width: '100%', 
                        maxWidth: isMobile ? '120px' : '150px',
                        minWidth: isMobile ? '80px' : '120px',
                        margin: '0 auto'
                      }}
                    >
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
                      
                      <div className="mt-1 flex flex-col items-center gap-1 w-full">
                        {displayOptions.investment && (
                          <div className="text-xs text-white/90 truncate w-full text-center">
                            Investment: ${formatCompactNumber(project.investedAmount || 0)}
                          </div>
                        )}
                        {displayOptions.earning && (
                          <div className="text-xs text-white/90 truncate w-full text-center">
                            Earned: ${formatCompactNumber(project.earnedAmount || 0)}
                          </div>
                        )}
                        {displayOptions.expected && (
                          <div className="text-xs text-white/90 truncate w-full text-center">
                            Expected: ${formatCompactNumber(project.expectedAmount || 0)}
                          </div>
                        )}
                        {displayOptions.stats && project.stats && project.stats.length > 0 && (
                          project.stats.map((stat, index) => (
                            <div key={index} className="text-xs text-white/90 truncate w-full text-center">
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
        
        {totalPages > 1 && filteredProjects.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePreviousPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem className="flex items-center">
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        
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
