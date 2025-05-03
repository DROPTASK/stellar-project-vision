
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Grid, Table as TableIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCompactNumber } from '../../lib/utils';

interface Project {
  name: string;
  investedAmount?: number;
  earnedAmount?: number;
  expectedAmount?: number;
  stats?: { type: string; amount: number }[];
}

interface ProjectReviewProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: string;
}

const ProjectReview: React.FC<ProjectReviewProps> = ({ isOpen, onClose, projectData }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileName, setProfileName] = useState<string>("Unknown User");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [hasInvestment, setHasInvestment] = useState(false);
  const [hasEarning, setHasEarning] = useState(false);
  const [hasExpected, setHasExpected] = useState(false);
  const [hasStats, setHasStats] = useState(false);
  
  useEffect(() => {
    if (projectData) {
      try {
        parseProjectData(projectData);
      } catch (error) {
        console.error("Error parsing project data:", error);
        setProjects([]);
      }
    } else {
      setProjects([]);
    }
  }, [projectData]);
  
  const parseProjectData = (data: string) => {
    // Extract the profile name from the first line
    const lines = data.split('\n');
    let nameMatch = lines[0].match(/\*\*(.*?) Projects\*\*/);
    if (nameMatch && nameMatch[1]) {
      setProfileName(nameMatch[1]);
    }
    
    const parsedProjects: Project[] = [];
    let currentProject: Project | null = null;
    let hasInv = false, hasEarn = false, hasExp = false, hasSta = false;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this is a project name line
      if (line.startsWith('○ **')) {
        if (currentProject) {
          parsedProjects.push(currentProject);
        }
        
        const nameMatch = line.match(/○ \*\*(.*?)\*\*/);
        if (nameMatch) {
          currentProject = {
            name: nameMatch[1],
            stats: []
          };
        }
      } 
      // Check for investment
      else if (line.startsWith('- *Inv:') && currentProject) {
        const match = line.match(/- \*Inv: \$([0-9,.k]+)\*/);
        if (match) {
          currentProject.investedAmount = parseAmount(match[1]);
          hasInv = true;
        }
      }
      // Check for earning
      else if (line.startsWith('- *Earn:') && currentProject) {
        const match = line.match(/- \*Earn: \$([0-9,.k]+)\*/);
        if (match) {
          currentProject.earnedAmount = parseAmount(match[1]);
          hasEarn = true;
        }
      }
      // Check for expected
      else if (line.startsWith('- *Exp:') && currentProject) {
        const match = line.match(/- \*Exp: \$([0-9,.k]+)\*/);
        if (match) {
          currentProject.expectedAmount = parseAmount(match[1]);
          hasExp = true;
        }
      }
      // Check for stats
      else if (line.startsWith('- *') && currentProject && !line.startsWith('- *Inv:') && !line.startsWith('- *Earn:') && !line.startsWith('- *Exp:')) {
        const match = line.match(/- \*(.*?): ([0-9,.k]+)\*/);
        if (match && match.length >= 3 && currentProject.stats) {
          currentProject.stats.push({
            type: match[1],
            amount: parseAmount(match[2])
          });
          hasSta = true;
        }
      }
    }
    
    // Add the last project if there is one
    if (currentProject) {
      parsedProjects.push(currentProject);
    }
    
    setProjects(parsedProjects);
    setHasInvestment(hasInv);
    setHasEarning(hasEarn);
    setHasExpected(hasExp);
    setHasStats(hasSta);
  };
  
  const parseAmount = (amountStr: string): number => {
    // Handle 'k' suffix (thousands)
    if (amountStr.endsWith('k')) {
      return parseFloat(amountStr.slice(0, -1)) * 1000;
    }
    
    // Remove commas and parse as float
    return parseFloat(amountStr.replace(/,/g, ''));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50 max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">{profileName}'s Projects</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          >
            {viewMode === 'grid' ? 
              <><TableIcon className="h-4 w-4 mr-1" /> Table View</> : 
              <><Grid className="h-4 w-4 mr-1" /> Grid View</>
            }
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {projects.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {projects.map((project, index) => (
                    <div 
                      key={index} 
                      className="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center"
                      style={{ width: '100%', minHeight: '120px' }}
                    >
                      <h3 className="font-medium text-center mb-2">{project.name}</h3>
                      
                      <div className="mt-1 flex flex-col items-center gap-1 w-full">
                        {hasInvestment && project.investedAmount !== undefined && (
                          <div className="text-xs text-white/90 truncate w-full text-center">
                            Inv: ${formatCompactNumber(project.investedAmount)}
                          </div>
                        )}
                        {hasEarning && project.earnedAmount !== undefined && (
                          <div className="text-xs text-white/90 truncate w-full text-center">
                            Earn: ${formatCompactNumber(project.earnedAmount)}
                          </div>
                        )}
                        {hasExpected && project.expectedAmount !== undefined && (
                          <div className="text-xs text-white/90 truncate w-full text-center">
                            Exp: ${formatCompactNumber(project.expectedAmount)}
                          </div>
                        )}
                        {hasStats && project.stats && project.stats.length > 0 && (
                          project.stats.map((stat, statIndex) => (
                            <div key={statIndex} className="text-xs text-white/90 truncate w-full text-center">
                              {stat.type}: {formatCompactNumber(stat.amount)}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-black/30">
                        <TableHead>Project</TableHead>
                        {hasInvestment && <TableHead>Inv ($)</TableHead>}
                        {hasEarning && <TableHead>Earn ($)</TableHead>}
                        {hasExpected && <TableHead>Exp ($)</TableHead>}
                        {hasStats && <TableHead>Stats</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project, index) => (
                        <TableRow key={index} className="bg-black/20 hover:bg-black/40">
                          <TableCell className="font-medium">{project.name}</TableCell>
                          {hasInvestment && (
                            <TableCell className="text-white/90 text-sm">
                              ${project.investedAmount !== undefined ? formatCompactNumber(project.investedAmount) : 'N/A'}
                            </TableCell>
                          )}
                          {hasEarning && (
                            <TableCell className="text-white/90 text-sm">
                              ${project.earnedAmount !== undefined ? formatCompactNumber(project.earnedAmount) : 'N/A'}
                            </TableCell>
                          )}
                          {hasExpected && (
                            <TableCell className="text-white/90 text-sm">
                              ${project.expectedAmount !== undefined ? formatCompactNumber(project.expectedAmount) : 'N/A'}
                            </TableCell>
                          )}
                          {hasStats && (
                            <TableCell className="text-white/90 text-sm">
                              {project.stats && project.stats.length > 0 ? (
                                project.stats.map((stat, statIndex) => (
                                  <div key={statIndex}>
                                    {stat.type}: {formatCompactNumber(stat.amount)}
                                  </div>
                                ))
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <div className="p-4 text-center">
                <p>No project data available or unable to parse data.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please paste valid project data in the correct format.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectReview;
