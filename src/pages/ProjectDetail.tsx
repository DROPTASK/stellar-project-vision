import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetchProjectById = async (id: string) => {
  const { data, error } = await supabase
    .from('explore_projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

const fetchAllProjects = async () => {
  const { data, error } = await supabase
    .from('explore_projects')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id,
  });
  const { data: allProjects = [] } = useQuery({
    queryKey: ['explore-projects'],
    queryFn: fetchAllProjects,
  });

  if (isLoading || !project) return <div className="mt-10 text-center">Loading project…</div>;

  return (
    <div className="container mx-auto px-2 sm:px-4 pt-4 pb-20">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4 text-muted-foreground flex gap-1 items-center">
        <Link to="/" className="hover:text-primary font-semibold">Home</Link>
        <span className="mx-1">›</span>
        <Link to="/explore" className="hover:text-primary font-semibold">Explore</Link>
        <span className="mx-1">›</span>
        <span className="font-semibold text-primary">{project.name}</span>
      </nav>

      {/* Big logo and title */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-white/20 shadow-lg rounded-full border mb-3" style={{ width: 120, height: 120 }}>
          <img 
            src={project.logo}
            alt={project.name}
            className="object-cover rounded-full w-full h-full"
            style={{ background: "#222" }}
          />
        </div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      {/* Other details */}
      <div className="mb-6 text-center">
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {project.tags.map((tag: string, i: number) => (
              <span key={i} className="bg-secondary px-3 py-1 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4 justify-center text-sm mb-3">
          {project.funding && (<div><strong>Funding:</strong> {project.funding}</div>)}
          {project.reward && (<div><strong>Reward:</strong> {project.reward}</div>)}
          {project.tge && (<div><strong>TGE:</strong> {project.tge}</div>)}
        </div>
        {project.description && (
          <div className="max-w-xl mx-auto text-muted-foreground mb-3">{project.description}</div>
        )}
        {project.join_url && (
          <a 
            href={project.join_url}
            className="text-blue-600 hover:underline break-all"
            target="_blank" rel="noopener noreferrer"
          >
            Join Project
          </a>
        )}
      </div>

      {/* Horizontal scroll area of other projects */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Other Projects</h2>
        <ScrollArea className="flex gap-4 overflow-x-auto" style={{ whiteSpace: "nowrap", paddingBottom: 6 }}>
          <div className="flex gap-4">
            {allProjects.filter(p => p.id !== id).map((p) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="min-w-[180px] bg-card rounded-lg p-3 flex flex-col items-center border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden mb-2">
                  <img src={p.logo} alt={p.name} className="object-cover w-full h-full" />
                </div>
                <div className="font-semibold text-center text-sm">{p.name}</div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProjectDetail;
