
import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import ProjectCard from '../components/explore/ProjectCard';
import SimpleProjectCard from '../components/explore/SimpleProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Explore: React.FC = () => {
  const { exploreProjects } = useAppStore();
  const isMobile = useIsMobile();
  const [showHydraLinks, setShowHydraLinks] = useState(false);
  
  // First 10 projects with detailed cards, rest with simple cards
  const detailedProjects = exploreProjects.slice(0, 10);
  const simpleProjects = exploreProjects.slice(10);

  const hydraLinks = [
    { name: 'GiveRep', url: 'https://t.me/Ezzy_Looters/23786', focus: 'Must Focus' },
    { name: 'Momentum', url: 'https://t.me/Ezzy_Looters/23331', focus: 'Must Focus' },
    { name: 'Cube Exchange', url: 'https://t.me/Ezzy_Looters/22342', focus: 'Must Focus' },
    { name: 'Soul Labs', url: 'https://t.me/Ezzy_Looters/23714', focus: 'Focus' },
    { name: 'Arch Network', url: 'https://t.me/Ezzy_Looters/23030', focus: '' },
    { name: 'N1 Chain', url: 'https://t.me/Ezzy_Looters/23688', focus: '' },
    { name: 'N1 Chain Private Testnet', url: 'https://t.me/Ezzy_Looters/23706', focus: '' },
    { name: 'Linera', url: 'https://t.me/Ezzy_Looters/23658', focus: '' },
    { name: 'Huddle', url: 'https://t.me/Ezzy_Looters/23485', focus: '' },
    { name: 'Recall', url: 'https://t.me/Ezzy_Looters/23202', focus: '' },
    { name: 'OG Labs', url: 'https://t.me/Ezzy_Looters/22750', focus: '' },
    { name: 'Gpunet', url: 'https://t.me/Ezzy_Looters/23776', focus: '' },
    { name: 'inco', url: 'https://t.me/Ezzy_Looters/23800', focus: '' },
    { name: 'ByteNova', url: 'https://t.me/Ezzy_Looters/23767', focus: '' },
    { name: 'Fleek', url: 'https://t.me/Ezzy_Looters/23736', focus: '' },
    { name: 'Cess', url: 'https://t.me/Ezzy_Looters/23500', focus: '' },
    { name: 'Orochi Network', url: 'https://t.me/Ezzy_Looters/23695', focus: '' },
    { name: 'Interlink', url: 'https://t.me/Ezzy_Looters/23018', focus: '' },
    { name: 'CoreSky', url: 'https://t.me/Ezzy_Looters/23399', focus: 'TGE 8th May' },
    { name: 'Billion Network', url: 'https://t.me/Ezzy_Looters/22689', focus: '' },
    { name: 'Echo', url: 'https://t.me/Ezzy_Looters/22779', focus: '' },
    { name: 'Seal', url: 'https://t.me/Ezzy_Looters/23401', focus: '' },
    { name: 'The Root Network', url: 'https://t.me/Ezzy_Looters/23324', focus: '' },
    { name: 'Taker Protocol', url: 'https://t.me/Ezzy_Looters/23122', focus: '' },
    { name: 'Rainbow', url: 'https://t.me/Ezzy_Looters/23010', focus: '' },
    { name: 'Flow 3', url: 'https://t.me/Ezzy_Looters/23696', focus: '' },
    { name: '3Dos', url: 'https://t.me/Ezzy_Looters/22467', focus: 'Must Focus' },
    { name: 'Stork', url: 'https://t.me/Ezzy_Looters/22722', focus: '' },
    { name: 'Primus Labs', url: 'https://t.me/Ezzy_Looters/22612', focus: '' },
    { name: 'Nodego', url: 'https://t.me/Ezzy_Looters/22340', focus: '' },
    { name: 'Public Ai', url: 'https://t.me/Ezzy_Looters/22074', focus: '' },
    { name: 'Pipe Network', url: 'https://t.me/Ezzy_Looters/19852', focus: '' },
    { name: 'Bless Network', url: 'https://t.me/Ezzy_Looters/19764', focus: '' },
    { name: 'Alpha Network', url: 'https://t.me/Ezzy_Looters/19023', focus: '' },
    { name: 'Gradient', url: 'https://t.me/Ezzy_Looters/18342', focus: '' },
    { name: 'Teneo', url: 'https://t.me/Ezzy_Looters/18102', focus: '' },
    { name: 'Dawn', url: 'https://t.me/Ezzy_Looters/18005', focus: '' },
    { name: 'Depin', url: 'https://t.me/Ezzy_Looters/20909', focus: '' },
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24">
      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
          <Button 
            onClick={() => setShowHydraLinks(!showHydraLinks)} 
            size="sm"
            className="btn-gradient"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            {showHydraLinks ? "Show Projects" : "Hydra Channel"}
          </Button>
        </div>

        {showHydraLinks ? (
          <div className="mb-6">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                <h3 className="font-semibold text-center mb-2">Active Testnet & Project Airdrop List</h3>
                {hydraLinks.map((link, index) => (
                  <div key={index} className="glass-card p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium">{link.name}</span>
                        {link.focus && (
                          <span className="ml-2 text-xs bg-blue-600/70 px-2 py-0.5 rounded-full">
                            {link.focus}
                          </span>
                        )}
                      </div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center text-xs"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className={`space-y-4 mb-6`}>
              {detailedProjects.map((project) => {
                // Add hydra links to the projects
                const hydraLink = hydraLinks.find(link => 
                  link.name.toLowerCase() === project.name.toLowerCase()
                )?.url;
                
                return (
                  <ProjectCard 
                    key={project.id} 
                    project={{...project, hydraLink}}
                  />
                );
              })}
            </div>
            
            {simpleProjects.length > 0 && (
              <>
                <Separator className="my-6 bg-white/10" />
                
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-4">More Projects</h2>
                  <div className="space-y-2">
                    {simpleProjects.map((project) => {
                      // Add hydra links to the simple projects
                      const hydraLink = hydraLinks.find(link => 
                        link.name.toLowerCase() === project.name.toLowerCase()
                      )?.url;
                      
                      return (
                        <SimpleProjectCard 
                          key={project.id} 
                          project={{...project, hydraLink}}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Explore;
