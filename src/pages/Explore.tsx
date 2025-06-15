
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProjectCard from '../components/explore/ProjectCard';
import SimpleProjectCard from '../components/explore/SimpleProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '../hooks/use-mobile';
import BannerCarousel from '../components/explore/BannerCarousel';

const fetchExploreProjects = async () => {
  const { data, error } = await supabase
    .from('explore_projects')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
};

const Explore: React.FC = () => {
  const isMobile = useIsMobile();
  const { data: exploreProjects = [], isLoading, error } = useQuery({
    queryKey: ['explore-projects'],
    queryFn: fetchExploreProjects,
  });

  const projectsMap = useMemo(() => {
    const map = new Map();
    for (const p of exploreProjects) map.set(p.id, p);
    return map;
  }, [exploreProjects]);

  // Same preprocessing as before, but dynamic
  const processedProjects = (exploreProjects || []).map(project => {
    const processed = { ...project };
    if (processed.funding) processed.funding = `💵 ${processed.funding}`;
    if (processed.reward) processed.reward = `👌 ${processed.reward}`;
    if (processed.tge) processed.tge = `🗓 ${processed.tge}`;
    delete processed.hydraLink;
    return processed;
  });

  const processedDetailedProjects = processedProjects.slice(0, 10);
  const processedSimpleProjects = processedProjects.slice(10);

  if (isLoading) return <div className="text-center mt-20 text-lg">Loading projects...</div>;
  if (error) return <div className="text-center mt-20 text-destructive">Failed to load projects.</div>;

  return (
    <div className="container mx-auto px-2 sm:px-4 pb-24">
      <BannerCarousel type="recent" projectsMap={projectsMap} />
      <BannerCarousel type="hot" projectsMap={projectsMap} />

      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 mb-6">
            {processedDetailedProjects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                toDetail={true} // pass prop to allow detail linking
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
                      toDetail={true}
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
