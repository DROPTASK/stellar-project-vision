
import React from 'react';
import { useAppStore } from '../store/appStore';
import ProjectCard from '../components/explore/ProjectCard';
import SimpleProjectCard from '../components/explore/SimpleProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const Explore: React.FC = () => {
  const { exploreProjects } = useAppStore();
  
  // First 10 projects with detailed cards, rest with simple cards
  const detailedProjects = exploreProjects.slice(0, 10);
  const simpleProjects = exploreProjects.slice(10);

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-2">
        <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 mb-6">
            {detailedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {simpleProjects.length > 0 && (
            <>
              <Separator className="my-6 bg-white/10" />
              
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-4">More Projects</h2>
                {simpleProjects.map((project) => (
                  <SimpleProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Explore;
