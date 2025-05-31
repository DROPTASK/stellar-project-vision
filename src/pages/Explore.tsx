
import React from 'react';
import ProjectCard from '../components/explore/ProjectCard';
import SimpleProjectCard from '../components/explore/SimpleProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '../hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExploreProject } from '../types';

const Explore: React.FC = () => {
  const isMobile = useIsMobile();

  // Fetch projects from Supabase
  const { data: exploreProjects = [], isLoading, error } = useQuery({
    queryKey: ['exploreProjects'],
    queryFn: async () => {
      console.log('Fetching explore projects from Supabase...');
      const { data, error } = await supabase
        .from('explore_projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching explore projects:', error);
        throw error;
      }

      console.log('Fetched explore projects:', data);
      
      // Transform database data to match ExploreProject interface
      const transformedData: ExploreProject[] = data.map(project => ({
        id: project.id,
        name: project.name,
        logo: project.logo || '',
        tags: project.tags || [],
        funding: project.funding || undefined,
        reward: project.reward || undefined,
        tge: project.tge || undefined,
        description: project.description || undefined,
        joinUrl: project.join_url || undefined
      }));

      return transformedData;
    }
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 pb-24">
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
          <div className="flex items-center justify-center h-64">
            <p>Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 pb-24">
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading projects. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24">
      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {processedDetailedProjects.length > 0 ? (
            <div className={`space-y-4 mb-6`}>
              {processedDetailedProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects available yet.</p>
            </div>
          )}
          
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
