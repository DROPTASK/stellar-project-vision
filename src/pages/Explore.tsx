
import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import ProjectCard from '../components/explore/ProjectCard';
import SimpleProjectCard from '../components/explore/SimpleProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '../hooks/use-mobile';

const Explore: React.FC = () => {
  const { exploreProjects } = useAppStore();
  const isMobile = useIsMobile();
  
  // First 10 projects with detailed cards, rest with simple cards
  const detailedProjects = exploreProjects.slice(0, 10);
  const simpleProjects = exploreProjects.slice(10);

  // Add emojis to project details
  const processedProjects = exploreProjects.map(project => {
    const processed = {...project};
    
    // Add emojis to funding information if it exists
    if (processed.funding) {
      processed.funding = `💵 ${processed.funding}`;
    }
    
    // Add emojis to reward information if it exists
    if (processed.reward) {
      processed.reward = `👌 ${processed.reward}`;
    }
    
    // Add emojis to TGE information if it exists
    if (processed.tge) {
      processed.tge = `🗓 ${processed.tge}`;
    }
    
    return processed;
  });
  
  const processedDetailedProjects = processedProjects.slice(0, 10);
  const processedSimpleProjects = processedProjects.slice(10);

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24">
      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className={`space-y-4 mb-6`}>
            {processedDetailedProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
              />
            ))}
          </div>
          
          {processedSimpleProjects.length > 0 && (
            <>
              <Separator className="my-6 bg-white/10" />
              
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-4">More Projects</h2>
                <div className="space-y-2">
                  {processedSimpleProjects.map((project) => (
                    <SimpleProjectCard 
                      key={project.id} 
                      project={project}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Explore;
