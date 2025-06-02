
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '../components/theme-provider';
import { Check, Edit, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseProject {
  id: string;
  name: string;
  logo: string | null;
  tags: string[] | null;
  funding: string | null;
  reward: string | null;
  tge: string | null;
  description: string | null;
  join_url: string | null;
  order_index: number | null;
}

interface DatabaseUpdate {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  date: string;
}

const Admin: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and then show admin interface
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // If we're directly on /admin, redirect to the admin interface
  useEffect(() => {
    if (location.pathname === '/admin') {
      window.location.href = '/admin/index.html';
      return;
    }
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-24">
        <div className="mt-6 mb-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-full">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <ProjectsAdminTab />
          </TabsContent>
          
          <TabsContent value="updates">
            <UpdatesAdminTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ProjectsAdminTab: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState<Omit<DatabaseProject, 'id'>>({
    name: '',
    logo: '',
    tags: [],
    description: '',
    join_url: '',
    order_index: 0,
    funding: null,
    reward: null,
    tge: null
  });

  // Fetch projects from Supabase
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('explore_projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as DatabaseProject[];
    }
  });

  // Mutations for CRUD operations
  const createProjectMutation = useMutation({
    mutationFn: async (project: Omit<DatabaseProject, 'id'>) => {
      const { data, error } = await supabase
        .from('explore_projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['exploreProjects'] });
      toast({
        title: "Project created",
        description: "The new project has been added successfully",
      });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: DatabaseProject) => {
      const { data, error } = await supabase
        .from('explore_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['exploreProjects'] });
      toast({
        title: "Project updated",
        description: "The project has been updated successfully",
      });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('explore_projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['exploreProjects'] });
      toast({
        title: "Project deleted",
        description: "The project has been removed successfully",
      });
    }
  });

  const handleEditToggle = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddProject = () => {
    if (newProject.name && newProject.logo) {
      createProjectMutation.mutate(newProject);
      setNewProject({
        name: '',
        logo: '',
        tags: [],
        description: '',
        join_url: '',
        order_index: 0,
        funding: null,
        reward: null,
        tge: null
      });
      setShowNewProjectForm(false);
    } else {
      toast({
        title: "Error",
        description: "Project name and logo are required",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = (project: DatabaseProject) => {
    updateProjectMutation.mutate(project);
    setEditMode(prev => ({ ...prev, [project.id]: false }));
  };

  const handleDeleteProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading projects...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Projects</h2>
        <Button onClick={() => setShowNewProjectForm(!showNewProjectForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showNewProjectForm ? 'Cancel' : 'Add New Project'}
        </Button>
      </div>

      {showNewProjectForm && (
        <Card className={`mb-6 ${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                placeholder="Project name"
                value={newProject.name || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))} 
              />
              <Input 
                placeholder="Logo URL"
                value={newProject.logo || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, logo: e.target.value }))} 
              />
              <Input 
                placeholder="Funding (e.g., $4.50m)"
                value={newProject.funding || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, funding: e.target.value }))} 
              />
              <Input 
                placeholder="Reward (e.g., POTENTIAL)"
                value={newProject.reward || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, reward: e.target.value }))} 
              />
              <Input 
                placeholder="TGE (e.g., Done✅)"
                value={newProject.tge || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, tge: e.target.value }))} 
              />
              <Input 
                placeholder="Join URL"
                value={newProject.join_url || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, join_url: e.target.value }))} 
              />
              <Textarea 
                placeholder="Description"
                value={newProject.description || ''} 
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))} 
                rows={3}
              />
              <Button onClick={handleAddProject} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectAdminCard 
              key={project.id} 
              project={project}
              editMode={editMode[project.id] || false}
              onEditToggle={() => handleEditToggle(project.id)}
              onUpdate={handleUpdateProject}
              onDelete={() => handleDeleteProject(project.id)}
              theme={theme}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

const ProjectAdminCard: React.FC<{
  project: DatabaseProject;
  editMode: boolean;
  onEditToggle: () => void;
  onUpdate: (project: DatabaseProject) => void;
  onDelete: () => void;
  theme: string;
}> = ({ project, editMode, onEditToggle, onUpdate, onDelete, theme }) => {
  const [editedProject, setEditedProject] = useState<DatabaseProject>(project);

  useEffect(() => {
    setEditedProject(project);
  }, [project]);

  const handleSave = () => {
    onUpdate(editedProject);
  };

  return (
    <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-background">
              <img 
                src={editedProject.logo || '/placeholder.svg'} 
                alt={editedProject.name} 
                className="object-cover h-full w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            {editMode ? (
              <Input 
                value={editedProject.name} 
                onChange={(e) => setEditedProject(prev => ({ ...prev, name: e.target.value }))}
                className="font-semibold text-lg"
              />
            ) : (
              <h3 className="font-semibold text-lg">{editedProject.name}</h3>
            )}
          </div>
          <div className="flex space-x-2">
            {editMode ? (
              <Button onClick={handleSave} size="sm" variant="outline">
                <Check className="h-4 w-4" />
                Save
              </Button>
            ) : (
              <Button onClick={onEditToggle} size="sm" variant="outline">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            <Button 
              onClick={onDelete} 
              size="sm"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <Input 
              placeholder="Logo URL"
              value={editedProject.logo || ''} 
              onChange={(e) => setEditedProject(prev => ({ ...prev, logo: e.target.value }))}
            />
            <Input 
              placeholder="Funding"
              value={editedProject.funding || ''} 
              onChange={(e) => setEditedProject(prev => ({ ...prev, funding: e.target.value }))}
            />
            <Input 
              placeholder="Reward"
              value={editedProject.reward || ''} 
              onChange={(e) => setEditedProject(prev => ({ ...prev, reward: e.target.value }))}
            />
            <Input 
              placeholder="TGE"
              value={editedProject.tge || ''} 
              onChange={(e) => setEditedProject(prev => ({ ...prev, tge: e.target.value }))}
            />
            <Input 
              placeholder="Join URL"
              value={editedProject.join_url || ''} 
              onChange={(e) => setEditedProject(prev => ({ ...prev, join_url: e.target.value }))}
            />
            <Textarea 
              placeholder="Description"
              value={editedProject.description || ''} 
              onChange={(e) => setEditedProject(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
              {editedProject.funding && (
                <div>
                  <span className="text-muted-foreground">Funding:</span> {editedProject.funding}
                </div>
              )}
              {editedProject.reward && (
                <div>
                  <span className="text-muted-foreground">Reward:</span> {editedProject.reward}
                </div>
              )}
              {editedProject.tge && (
                <div>
                  <span className="text-muted-foreground">TGE:</span> {editedProject.tge}
                </div>
              )}
            </div>
            {editedProject.description && (
              <p className="text-muted-foreground text-sm mt-2">{editedProject.description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UpdatesAdminTab: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [showNewUpdateForm, setShowNewUpdateForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState<Omit<DatabaseUpdate, 'id'>>({
    title: '',
    image: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch updates from Supabase
  const { data: updates = [], isLoading } = useQuery({
    queryKey: ['adminUpdates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as DatabaseUpdate[];
    }
  });

  // Mutations for CRUD operations
  const createUpdateMutation = useMutation({
    mutationFn: async (update: Omit<DatabaseUpdate, 'id'>) => {
      const { data, error } = await supabase
        .from('updates')
        .insert([update])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpdates'] });
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      toast({
        title: "Update created",
        description: "The new update has been added successfully",
      });
    }
  });

  const updateUpdateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: DatabaseUpdate) => {
      const { data, error } = await supabase
        .from('updates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpdates'] });
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      toast({
        title: "Update saved",
        description: "The update has been saved successfully",
      });
    }
  });

  const deleteUpdateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpdates'] });
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      toast({
        title: "Update deleted",
        description: "The update has been removed successfully",
      });
    }
  });

  const handleAddUpdate = () => {
    if (newUpdate.title && newUpdate.description) {
      createUpdateMutation.mutate(newUpdate);
      setNewUpdate({
        title: '',
        image: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowNewUpdateForm(false);
    } else {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUpdate = (update: DatabaseUpdate) => {
    updateUpdateMutation.mutate(update);
    setEditMode(prev => ({ ...prev, [update.id]: false }));
  };

  const handleDeleteUpdate = (id: string) => {
    deleteUpdateMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading updates...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Updates</h2>
        <Button onClick={() => setShowNewUpdateForm(!showNewUpdateForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showNewUpdateForm ? 'Cancel' : 'Add New Update'}
        </Button>
      </div>

      {showNewUpdateForm && (
        <Card className={`mb-6 ${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
          <CardHeader>
            <CardTitle>Add New Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                placeholder="Update title"
                value={newUpdate.title || ''} 
                onChange={(e) => setNewUpdate(prev => ({ ...prev, title: e.target.value }))} 
              />
              <Input 
                placeholder="Image URL"
                value={newUpdate.image || ''} 
                onChange={(e) => setNewUpdate(prev => ({ ...prev, image: e.target.value }))} 
              />
              <Input 
                type="date"
                value={newUpdate.date || ''} 
                onChange={(e) => setNewUpdate(prev => ({ ...prev, date: e.target.value }))} 
              />
              <Textarea 
                placeholder="Update description"
                value={newUpdate.description || ''} 
                onChange={(e) => setNewUpdate(prev => ({ ...prev, description: e.target.value }))} 
                rows={4}
              />
              <Button onClick={handleAddUpdate} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-4">
          {updates.map((update) => (
            <UpdateAdminCard 
              key={update.id} 
              update={update}
              editMode={editMode[update.id] || false}
              onEditToggle={() => setEditMode(prev => ({ ...prev, [update.id]: !prev[update.id] }))}
              onUpdate={handleUpdateUpdate}
              onDelete={() => handleDeleteUpdate(update.id)}
              theme={theme}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

const UpdateAdminCard: React.FC<{
  update: DatabaseUpdate;
  editMode: boolean;
  onEditToggle: () => void;
  onUpdate: (update: DatabaseUpdate) => void;
  onDelete: () => void;
  theme: string;
}> = ({ update, editMode, onEditToggle, onUpdate, onDelete, theme }) => {
  const [editedUpdate, setEditedUpdate] = useState<DatabaseUpdate>(update);

  useEffect(() => {
    setEditedUpdate(update);
  }, [update]);

  const handleSave = () => {
    onUpdate(editedUpdate);
  };

  return (
    <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {editMode ? (
              <Input 
                value={editedUpdate.title} 
                onChange={(e) => setEditedUpdate(prev => ({ ...prev, title: e.target.value }))}
                className="font-semibold text-lg mb-1"
              />
            ) : (
              <h3 className="font-semibold text-lg">{editedUpdate.title}</h3>
            )}
            <p className="text-sm text-muted-foreground">
              {editMode ? (
                <Input 
                  type="date"
                  value={editedUpdate.date.split('T')[0]} 
                  onChange={(e) => setEditedUpdate(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                new Date(editedUpdate.date).toLocaleDateString()
              )}
            </p>
          </div>
          <div className="flex space-x-2">
            {editMode ? (
              <Button onClick={handleSave} size="sm" variant="outline">
                <Check className="h-4 w-4" />
                Save
              </Button>
            ) : (
              <Button onClick={onEditToggle} size="sm" variant="outline">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            <Button 
              onClick={onDelete} 
              size="sm"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <Input 
              placeholder="Image URL"
              value={editedUpdate.image || ''} 
              onChange={(e) => setEditedUpdate(prev => ({ ...prev, image: e.target.value }))}
            />
            <Textarea 
              placeholder="Description"
              value={editedUpdate.description || ''} 
              onChange={(e) => setEditedUpdate(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {editedUpdate.image && (
              <div className="w-full h-40 bg-muted rounded-md overflow-hidden">
                <img 
                  src={editedUpdate.image} 
                  alt={editedUpdate.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
            <p className="text-muted-foreground text-sm">{editedUpdate.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Admin;
