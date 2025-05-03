
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download, Copy, Table, ScrollText } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';
import { formatCompactNumber } from '../../lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Table as UITable, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
  
  // View state (grid or table)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Dropdown state to prevent auto-closing
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  
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
  
  const handleCopyText = () => {
    const text = generateCopyText();
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Text copied to clipboard'))
      .catch(() => toast.error('Failed to copy text'));
  };

  const generateCopyText = () => {
    let text = "**My Projects**\n\n";
    
    filteredProjects.forEach(project => {
      text += `○ **${project.name}**\n`;
      
      if (displayOptions.investment) {
        text += `- *Inv.: $${formatCompactNumber(project.investedAmount || 0)}*\n`;
      }
      
      if (displayOptions.earning) {
        text += `- *Earn.: $${formatCompactNumber(project.earnedAmount || 0)}*\n`;
      }
      
      if (displayOptions.expected) {
        text += `- *Exp.: $${formatCompactNumber(project.expectedAmount || 0)}*\n`;
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
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <>
                <Table className="mr-1 h-4 w-4" />
                Table View
              </>
            ) : (
              <>
                <ScrollText className="mr-1 h-4 w-4" />
                Grid View
              </>
            )}
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div 
              ref={imageRef} 
              className="w-full p-4 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg"
            >
              <h2 className="text-xl font-display text-white text-center mb-4">My Projects</h2>
              
              {filteredProjects.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className={`grid ${getGridColumns()} gap-3`}>
                    {filteredProjects.map(project => (
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
                              Inv.: ${formatCompactNumber(project.investedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.earning && (
                            <div className="text-xs text-white/90 truncate w-full text-center">
                              Earn.: ${formatCompactNumber(project.earnedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.expected && (
                            <div className="text-xs text-white/90 truncate w-full text-center">
                              Exp.: ${formatCompactNumber(project.expectedAmount || 0)}
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
                  <UITable className="border border-white/10 rounded-md overflow-hidden">
                    <TableHeader className="bg-black/30">
                      <TableRow>
                        <TableHead className="text-white w-[180px]">Project</TableHead>
                        {displayOptions.investment && <TableHead className="text-white text-right">Inv. ($)</TableHead>}
                        {displayOptions.earning && <TableHead className="text-white text-right">Earn. ($)</TableHead>}
                        {displayOptions.expected && <TableHead className="text-white text-right">Exp. ($)</TableHead>}
                        {displayOptions.stats && <TableHead className="text-white text-right">Stats</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map(project => (
                        <TableRow key={project.id} className="border-white/10">
                          <TableCell className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md overflow-hidden bg-muted/30">
                              {project.logo ? (
                                <img 
                                  src={project.logo} 
                                  alt={`${project.name} logo`}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-700 text-white">
                                  {project.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span className="text-white font-medium">{project.name}</span>
                          </TableCell>
                          
                          {displayOptions.investment && (
                            <TableCell className="text-white/90 text-right">
                              {formatCompactNumber(project.investedAmount || 0)}
                            </TableCell>
                          )}
                          
                          {displayOptions.earning && (
                            <TableCell className="text-white/90 text-right">
                              {formatCompactNumber(project.earnedAmount || 0)}
                            </TableCell>
                          )}
                          
                          {displayOptions.expected && (
                            <TableCell className="text-white/90 text-right">
                              {formatCompactNumber(project.expectedAmount || 0)}
                            </TableCell>
                          )}
                          
                          {displayOptions.stats && (
                            <TableCell className="text-white/90 text-right">
                              {project.stats && project.stats.length > 0 ? (
                                <div className="flex flex-col items-end">
                                  {project.stats.map((stat, idx) => (
                                    <div key={idx} className="text-xs">
                                      {stat.type}: {formatCompactNumber(stat.amount)}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
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
        
        <div className="flex gap-3 mt-4">
          <Button onClick={handleCopyText} className="flex-1">
            <Copy className="mr-2 h-4 w-4" />
            Copy Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
