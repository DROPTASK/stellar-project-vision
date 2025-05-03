
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download, Copy, Table, Grid, UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';
import { formatCompactNumber } from '../../lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [userName, setUserName] = useState('My');
  
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
        // Set a delay to ensure all content is rendered
        setTimeout(async () => {
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
          
          // Create an anchor element and trigger download
          const link = document.createElement('a');
          link.download = `${userName}-projects.png`;
          link.href = dataUrl;
          document.body.appendChild(link); // Needed for Firefox
          link.click();
          document.body.removeChild(link);
          
          toast.success('Image downloaded successfully');
        }, 100); // Small delay to ensure rendering
      } catch (error) {
        console.error('Error generating image:', error);
        toast.error('Failed to generate image');
      }
    }
  };

  const generateShareData = () => {
    let text = `**${userName}'s Projects**\n\n`;
    
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
    const text = generateShareData();
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Project data copied to clipboard'))
      .catch(() => toast.error('Failed to copy data'));
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
            <DropdownMenuContent className="max-h-60 overflow-hidden">
              <ScrollArea className="h-60 pr-4">
                <div className="p-2">
                  {projects.map(project => (
                    <div 
                      key={project.id}
                      className="flex items-center space-x-2 mb-2 p-1 hover:bg-accent/10 rounded-md"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleProjectSelection(project.id);
                      }}
                    >
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4" 
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => {}} // Dummy handler since click is handled on parent div
                      />
                      <span>{project.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex space-x-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon" 
              className="h-8 w-8 p-0" 
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="icon" 
              className="h-8 w-8 p-0" 
              onClick={() => setViewMode('table')}
            >
              <Table size={16} />
            </Button>
          </div>
        </div>
        
        <div className="mb-3">
          <Label htmlFor="user-name" className="text-sm mb-1">Your Name</Label>
          <Input 
            id="user-name" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="bg-muted/30"
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div 
              ref={imageRef} 
              className="w-full p-4 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg"
            >
              <h2 className="text-xl font-display text-white text-center mb-4">{userName}'s Projects</h2>
              
              {currentProjects.length > 0 ? (
                viewMode === 'grid' ? (
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
                              Inv: ${formatCompactNumber(project.investedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.earning && (
                            <div className="text-xs text-white/90 truncate w-full text-center">
                              Earn: ${formatCompactNumber(project.earnedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.expected && (
                            <div className="text-xs text-white/90 truncate w-full text-center">
                              Exp: ${formatCompactNumber(project.expectedAmount || 0)}
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
                  // Table view
                  <div className="overflow-hidden rounded-lg bg-black/30 backdrop-blur-sm">
                    <table className="w-full text-white text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-2">Project</th>
                          {displayOptions.investment && <th className="text-right p-2">Inv ($)</th>}
                          {displayOptions.earning && <th className="text-right p-2">Earn ($)</th>}
                          {displayOptions.expected && <th className="text-right p-2">Exp ($)</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {currentProjects.map(project => (
                          <tr key={project.id} className="border-b border-white/10">
                            <td className="p-2 flex items-center">
                              <div className="w-6 h-6 rounded mr-2 overflow-hidden bg-muted/30 flex-shrink-0">
                                {project.logo ? (
                                  <img 
                                    src={project.logo} 
                                    alt={`${project.name} logo`}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-indigo-700 text-[8px]">
                                    {project.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="truncate max-w-[80px]">{project.name}</span>
                            </td>
                            {displayOptions.investment && (
                              <td className="p-2 text-right">{formatCompactNumber(project.investedAmount || 0)}</td>
                            )}
                            {displayOptions.earning && (
                              <td className="p-2 text-right">{formatCompactNumber(project.earnedAmount || 0)}</td>
                            )}
                            {displayOptions.expected && (
                              <td className="p-2 text-right">{formatCompactNumber(project.expectedAmount || 0)}</td>
                            )}
                          </tr>
                        ))}
                        {/* Summary row */}
                        <tr className="bg-white/10">
                          <td className="p-2 font-bold">Total</td>
                          {displayOptions.investment && (
                            <td className="p-2 text-right font-bold">
                              {formatCompactNumber(filteredProjects.reduce((sum, p) => sum + (p.investedAmount || 0), 0))}
                            </td>
                          )}
                          {displayOptions.earning && (
                            <td className="p-2 text-right font-bold">
                              {formatCompactNumber(filteredProjects.reduce((sum, p) => sum + (p.earnedAmount || 0), 0))}
                            </td>
                          )}
                          {displayOptions.expected && (
                            <td className="p-2 text-right font-bold">
                              {formatCompactNumber(filteredProjects.reduce((sum, p) => sum + (p.expectedAmount || 0), 0))}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Custom stats section in table view */}
                    {displayOptions.stats && (
                      <div className="p-2 border-t border-white/10">
                        <p className="font-semibold mb-1">Custom Stats:</p>
                        <div className="flex flex-wrap gap-2">
                          {filteredProjects.flatMap(project => 
                            project.stats?.map((stat, index) => (
                              <div key={`${project.id}-${index}`} className="bg-white/10 rounded-full px-2 py-0.5 text-[10px]">
                                {project.name}: {stat.type} {formatCompactNumber(stat.amount)}
                              </div>
                            )) || []
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
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
            Share Data
          </Button>
          <Button onClick={handleDownload} className="flex-1 btn-gradient">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
