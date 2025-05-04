
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Copy, Table, ScrollText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';
import { formatCompactNumber } from '../../lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Table as UITable, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { generatePDF } from '../../lib/pdfUtils';
import { Toggle } from '../ui/toggle';

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
  
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'bright'>('dark');
  
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
             filteredProjects.length <= 4 ? 'grid-cols-2' : 
             'grid-cols-3';
    }
    return filteredProjects.length <= 4 ? 'grid-cols-2' : 
           filteredProjects.length <= 9 ? 'grid-cols-3' : 
           'grid-cols-4';
  };

  // Get background based on theme
  const getBackground = () => {
    if (theme === 'dark') {
      return 'bg-gradient-to-b from-indigo-900 to-purple-900';
    } else {
      return 'bg-gradient-to-b from-blue-100 to-white';
    }
  };

  // Get text color based on theme
  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-800';
  };

  // Get backdrop color based on theme
  const getBackdropColor = () => {
    return theme === 'dark' ? 'bg-black/30' : 'bg-white/60';
  };

  // Download as PDF - Enhanced for Telegram browser compatibility
  const handleDownloadPDF = async () => {
    try {
      // Adding a small delay to ensure all content is rendered
      setTimeout(async () => {
        const success = await generatePDF(imageRef, `my-projects-${viewMode}.pdf`, {
          margin: [10, 10, 10, 10], // Add margins to prevent content cutoff
          enableLinks: false, // Disable links for better compatibility
          filename: `my-projects-${viewMode}.pdf`,
          image: { type: 'jpeg', quality: 0.95 }, // Use JPEG for better compatibility
          html2canvas: { 
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            allowTaint: true
          }
        });
        
        if (success) {
          toast.success('PDF downloaded successfully');
        } else {
          // Alternative download method for Telegram browser
          try {
            if (imageRef.current) {
              const dataUrl = await toPng(imageRef.current, { 
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: theme === 'dark' ? '#1a1b26' : '#ffffff'
              });
              
              const link = document.createElement('a');
              link.download = `my-projects-${viewMode}.png`;
              link.href = dataUrl;
              link.click();
              toast.success('Project image downloaded successfully');
            }
          } catch (err) {
            toast.error('Failed to generate image or PDF');
            console.error(err);
          }
        }
      }, 500);
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50 max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">Share My Projects</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-1">
            <Toggle
              pressed={viewMode === 'table'}
              onPressedChange={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              size="sm"
              aria-label={viewMode === 'grid' ? 'Switch to table view' : 'Switch to grid view'}
              className="p-1 h-7"
            >
              {viewMode === 'grid' ? <Table className="h-4 w-4" /> : <ScrollText className="h-4 w-4" />}
            </Toggle>
            
            <Toggle
              pressed={theme === 'bright'}
              onPressedChange={() => setTheme(theme === 'dark' ? 'bright' : 'dark')}
              size="sm"
              aria-label={theme === 'dark' ? 'Switch to bright theme' : 'Switch to dark theme'}
              className="p-1 h-7"
            >
              {theme === 'dark' ? 'B' : 'D'}
            </Toggle>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div 
              ref={imageRef} 
              className={`w-full p-4 rounded-lg ${getBackground()}`}
            >
              <h2 className={`text-xl font-display ${getTextColor()} text-center mb-4`}>My Projects</h2>
              
              {filteredProjects.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className={`grid ${getGridColumns()} gap-2`}>
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id} 
                        className={`${getBackdropColor()} backdrop-blur-sm p-2 rounded-lg flex flex-col items-center`} 
                        style={{ 
                          width: '100%', 
                          maxWidth: isMobile ? '75px' : '90px', // Smaller size
                          minWidth: isMobile ? '50px' : '65px',
                          margin: '0 auto'
                        }}
                      >
                        <div className="w-full aspect-square mb-1 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0"
                             style={{ maxHeight: isMobile ? '45px' : '55px' }}> {/* Control the height */}
                          {project.logo ? (
                            <img 
                              src={project.logo} 
                              alt={`${project.name} logo`}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-700 text-xs">
                              {project.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h3 className={`font-medium text-xs ${getTextColor()} text-center truncate w-full`}
                            style={{ fontSize: isMobile ? '8px' : '10px' }}>{project.name}</h3> {/* Smaller font */}
                        
                        <div className="mt-1 flex flex-col items-center gap-0.5 w-full">
                          {displayOptions.investment && (
                            <div className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'} truncate w-full text-center`}
                                 style={{ fontSize: '8px' }}> {/* Smaller font */}
                              Inv.: ${formatCompactNumber(project.investedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.earning && (
                            <div className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'} truncate w-full text-center`}
                                 style={{ fontSize: '8px' }}> {/* Smaller font */}
                              Earn.: ${formatCompactNumber(project.earnedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.expected && (
                            <div className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'} truncate w-full text-center`}
                                 style={{ fontSize: '8px' }}> {/* Smaller font */}
                              Exp.: ${formatCompactNumber(project.expectedAmount || 0)}
                            </div>
                          )}
                          {displayOptions.stats && project.stats && project.stats.length > 0 && (
                            project.stats.map((stat, index) => (
                              <div key={index} className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'} truncate w-full text-center`}
                                   style={{ fontSize: '8px' }}> {/* Smaller font */}
                                {stat.type}: {formatCompactNumber(stat.amount)}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UITable className={`border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} rounded-md overflow-hidden`}>
                    <TableHeader className={theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}>
                      <TableRow>
                        <TableHead className={theme === 'dark' ? 'text-white' : 'text-gray-800'} style={{ width: '150px' }}>Project</TableHead>
                        {displayOptions.investment && <TableHead className={theme === 'dark' ? 'text-white' : 'text-gray-800'} style={{ width: '80px', textAlign: 'right' }}>Inv. ($)</TableHead>}
                        {displayOptions.earning && <TableHead className={theme === 'dark' ? 'text-white' : 'text-gray-800'} style={{ width: '80px', textAlign: 'right' }}>Earn. ($)</TableHead>}
                        {displayOptions.expected && <TableHead className={theme === 'dark' ? 'text-white' : 'text-gray-800'} style={{ width: '80px', textAlign: 'right' }}>Exp. ($)</TableHead>}
                        {displayOptions.stats && <TableHead className={theme === 'dark' ? 'text-white' : 'text-gray-800'} style={{ width: '100px', textAlign: 'right' }}>Stats</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map(project => (
                        <TableRow key={project.id} className={theme === 'dark' ? 'border-white/10' : 'border-gray-200'}>
                          <TableCell className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md overflow-hidden bg-muted/30">
                              {project.logo ? (
                                <img 
                                  src={project.logo} 
                                  alt={`${project.name} logo`}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-700 text-white text-xs">
                                  {project.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span className={theme === 'dark' ? 'text-white font-medium text-sm' : 'text-gray-800 font-medium text-sm'}>{project.name}</span>
                          </TableCell>
                          
                          {displayOptions.investment && (
                            <TableCell className={theme === 'dark' ? 'text-white/90 text-right text-xs' : 'text-gray-700 text-right text-xs'}>
                              {formatCompactNumber(project.investedAmount || 0)}
                            </TableCell>
                          )}
                          
                          {displayOptions.earning && (
                            <TableCell className={theme === 'dark' ? 'text-white/90 text-right text-xs' : 'text-gray-700 text-right text-xs'}>
                              {formatCompactNumber(project.earnedAmount || 0)}
                            </TableCell>
                          )}
                          
                          {displayOptions.expected && (
                            <TableCell className={theme === 'dark' ? 'text-white/90 text-right text-xs' : 'text-gray-700 text-right text-xs'}>
                              {formatCompactNumber(project.expectedAmount || 0)}
                            </TableCell>
                          )}
                          
                          {displayOptions.stats && (
                            <TableCell className={theme === 'dark' ? 'text-white/90 text-right text-xs' : 'text-gray-700 text-right text-xs'}>
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
                <p className={getTextColor() + " text-center"}>No projects selected</p>
              )}
              
              <div className={`${getTextColor()} text-xs text-center mt-4`}>
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
          <Button onClick={handleDownloadPDF} className="flex-1">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
