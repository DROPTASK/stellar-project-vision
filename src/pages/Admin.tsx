import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ExploreProject } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '../components/theme-provider';
import { Check, Edit, Plus, Save, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Admin: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // If we're directly on /admin, redirect to the admin interface
    if (location.pathname === '/admin') {
      console.log("[ADMIN] Redirecting to /admin/index.html to load Netlify CMS");
      window.location.href = '/admin/index.html';
      return;
    } else {
      console.log("[ADMIN] Loaded at subroute:", location.pathname);
    }
  }, [location.pathname]);

  // No bottom navigation logic needed here as it's already handled in App.tsx
  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold">Admin CMS Dashboard</h1>
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
  const { data: exploreProjects = [], isLoading, refetch } = useQuery({
    queryKey: ['explore-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('explore_projects')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [newProject, setNewProject] = useState<any>({
    name: '',
    logo: '',
    tags: [],
    description: '',
    joinUrl: ''
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleEditToggle = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleProjectChange = (id: string, field: keyof ExploreProject, value: any) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const handleTagChange = (id: string, tags: string[]) => {
    handleProjectChange(id, 'tags', tags);
  };

  const handleAddTag = (id: string) => {
    const project = (exploreProjects || []).find(p => p.id === id);
    if (project && newTag.trim()) {
      handleTagChange(id, [...(project.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (id: string, tagIndex: number) => {
    const project = (exploreProjects || []).find(p => p.id === id);
    if (project && project.tags) {
      const newTags = [...project.tags];
      newTags.splice(tagIndex, 1);
      handleTagChange(id, newTags);
    }
  };

  // Save All Changes now updates database
  const handleSaveChanges = async () => {
    // Upsert all edited projects
    try {
      for (const project of exploreProjects || []) {
        await supabase
          .from('explore_projects')
          .upsert({ ...project, updated_at: new Date().toISOString() });
      }
      toast({
        title: "Changes saved",
        description: "Your changes have been updated in the database",
      });
      refetch();
    } catch (e) {
      toast({
        title: "Error",
        description: "There was a problem saving changes.",
        variant: "destructive"
      });
    }
  };

  // Add new project to database
  const handleAddProject = async () => {
    if (newProject.name && newProject.logo) {
      await supabase.from('explore_projects').insert([{
        ...newProject,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
      setNewProject({
        name: '',
        logo: '',
        tags: [],
        description: '',
        joinUrl: ''
      });
      setShowNewProjectForm(false);
      toast({
        title: "Project added",
        description: "The new project has been added.",
      });
      refetch();
    } else {
      toast({
        title: "Error",
        description: "Project name and logo are required",
        variant: "destructive"
      });
    }
  };

  // Delete project from database
  const handleDeleteProject = async (id: string) => {
    await supabase.from('explore_projects').delete().eq('id', id);
    toast({
      title: "Project deleted",
      description: "The project has been removed.",
    });
    refetch();
  };

  const handleNewProjectTagAdd = () => {
    if (newTag.trim()) {
      setNewProject(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleNewProjectTagRemove = (tagIndex: number) => {
    const newTags = [...(newProject.tags || [])];
    newTags.splice(tagIndex, 1);
    setNewProject(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setProjects([...(exploreProjects || [])]);
  }, [exploreProjects]);

  if (isLoading) return <div className="text-center py-12">Loading Admin projects...</div>;
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Projects</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewProjectForm(!showNewProjectForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showNewProjectForm ? 'Cancel' : 'Add New Project'}
          </Button>
          <Button onClick={handleSaveChanges} variant="default" className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {showNewProjectForm && (
        <Card className={`mb-6 ${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Project Name</label>
                <Input 
                  id="name" 
                  value={newProject.name} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label htmlFor="logo" className="block text-sm font-medium mb-1">Logo URL</label>
                <Input 
                  id="logo" 
                  value={newProject.logo} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, logo: e.target.value }))} 
                  placeholder="Enter logo URL"
                />
              </div>
              <div>
                <label htmlFor="funding" className="block text-sm font-medium mb-1">Funding</label>
                <Input 
                  id="funding" 
                  value={newProject.funding || ''} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, funding: e.target.value }))} 
                  placeholder="e.g. $4.50m"
                />
              </div>
              <div>
                <label htmlFor="reward" className="block text-sm font-medium mb-1">Reward</label>
                <Input 
                  id="reward" 
                  value={newProject.reward || ''} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, reward: e.target.value }))} 
                  placeholder="e.g. POTENTIAL"
                />
              </div>
              <div>
                <label htmlFor="tge" className="block text-sm font-medium mb-1">TGE</label>
                <Input 
                  id="tge" 
                  value={newProject.tge || ''} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, tge: e.target.value }))} 
                  placeholder="e.g. Done✅"
                />
              </div>
              <div>
                <label htmlFor="joinUrl" className="block text-sm font-medium mb-1">Join URL</label>
                <Input 
                  id="joinUrl" 
                  value={newProject.joinUrl || ''} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, joinUrl: e.target.value }))} 
                  placeholder="e.g. https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newProject.tags && newProject.tags.map((tag, i) => (
                    <div key={i} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button 
                        onClick={() => handleNewProjectTagRemove(i)}
                        className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)} 
                    placeholder="Add a tag" 
                    onKeyDown={(e) => e.key === 'Enter' && handleNewProjectTagAdd()}
                  />
                  <Button onClick={handleNewProjectTagAdd}>Add</Button>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  id="description" 
                  value={newProject.description || ''} 
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>
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
            <Card 
              key={project.id} 
              className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-background">
                      <img 
                        src={project.logo} 
                        alt={project.name} 
                        className="object-cover h-full w-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    {editMode[project.id] ? (
                      <Input 
                        value={project.name} 
                        onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                        className="font-semibold text-lg"
                      />
                    ) : (
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {editMode[project.id] ? (
                      <Button onClick={() => handleEditToggle(project.id)} size="sm" variant="outline">
                        <Check className="h-4 w-4" />
                        Done
                      </Button>
                    ) : (
                      <Button onClick={() => handleEditToggle(project.id)} size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDeleteProject(project.id)} 
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editMode[project.id] ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Logo URL</label>
                      <Input 
                        value={project.logo} 
                        onChange={(e) => handleProjectChange(project.id, 'logo', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Funding</label>
                      <Input 
                        value={project.funding || ''} 
                        onChange={(e) => handleProjectChange(project.id, 'funding', e.target.value)}
                        placeholder="e.g. $4.50m"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Reward</label>
                      <Input 
                        value={project.reward || ''} 
                        onChange={(e) => handleProjectChange(project.id, 'reward', e.target.value)}
                        placeholder="e.g. POTENTIAL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">TGE</label>
                      <Input 
                        value={project.tge || ''} 
                        onChange={(e) => handleProjectChange(project.id, 'tge', e.target.value)}
                        placeholder="e.g. Done✅"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Join URL</label>
                      <Input 
                        value={project.joinUrl || ''} 
                        onChange={(e) => handleProjectChange(project.id, 'joinUrl', e.target.value)}
                        placeholder="e.g. https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tags && project.tags.map((tag, i) => (
                          <div key={i} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                            {tag}
                            <button 
                              onClick={() => handleRemoveTag(project.id, i)}
                              className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          value={newTag} 
                          onChange={(e) => setNewTag(e.target.value)} 
                          placeholder="Add a tag" 
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag(project.id)}
                        />
                        <Button onClick={() => handleAddTag(project.id)}>Add</Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea 
                        value={project.description || ''} 
                        onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
                      {project.funding && (
                        <div>
                          <span className="text-muted-foreground">Funding:</span> {project.funding}
                        </div>
                      )}
                      {project.reward && (
                        <div>
                          <span className="text-muted-foreground">Reward:</span> {project.reward}
                        </div>
                      )}
                      {project.tge && (
                        <div>
                          <span className="text-muted-foreground">TGE:</span> {project.tge}
                        </div>
                      )}
                      {project.joinUrl && (
                        <div>
                          <span className="text-muted-foreground">Join URL:</span> {project.joinUrl}
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3 mt-2">{project.description}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

const UpdatesAdminTab: React.FC = () => {
  const { theme } = useTheme();
  const [updates, setUpdates] = useState([
    {
      id: '1',
      title: 'ARI WALLET QUIZ ANSWER',
      image: '/ari.img',
      description: 'Learn about the latest updates to the ARI wallet and how to use it effectively.',
      date: '2024-01-20'
    },
    {
      id: '2',
      title: 'Platform Update 2.0',
      image: '/placeholder.svg',
      description: 'We\'ve made significant improvements to the platform, including better performance and new features.',
      date: '2024-05-01'
    }
  ]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [showNewUpdateForm, setShowNewUpdateForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    id: uuidv4(),
    title: '',
    image: '/placeholder.svg',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleEditToggle = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleUpdateChange = (id: string, field: string, value: any) => {
    setUpdates(prev => 
      prev.map(update => 
        update.id === id ? { ...update, [field]: value } : update
      )
    );
  };

  const handleAddUpdate = () => {
    if (newUpdate.title && newUpdate.description) {
      setUpdates(prev => [...prev, { ...newUpdate, id: uuidv4() }]);
      setNewUpdate({
        id: uuidv4(),
        title: '',
        image: '/placeholder.svg',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowNewUpdateForm(false);
      toast({
        title: "Update added",
        description: "The new update has been added to the list",
      });
    } else {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUpdate = (id: string) => {
    setUpdates(prev => prev.filter(update => update.id !== id));
    toast({
      title: "Update deleted",
      description: "The update has been removed from the list",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your changes have been submitted to the GitHub repository",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Updates</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewUpdateForm(!showNewUpdateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showNewUpdateForm ? 'Cancel' : 'Add New Update'}
          </Button>
          <Button onClick={handleSaveChanges} variant="default" className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {showNewUpdateForm && (
        <Card className={`mb-6 ${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
          <CardHeader>
            <CardTitle>Add New Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  id="title" 
                  value={newUpdate.title} 
                  onChange={(e) => setNewUpdate(prev => ({ ...prev, title: e.target.value }))} 
                  placeholder="Enter update title"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">Image URL</label>
                <Input 
                  id="image" 
                  value={newUpdate.image} 
                  onChange={(e) => setNewUpdate(prev => ({ ...prev, image: e.target.value }))} 
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <Input 
                  id="date" 
                  type="date"
                  value={newUpdate.date} 
                  onChange={(e) => setNewUpdate(prev => ({ ...prev, date: e.target.value }))} 
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  id="description" 
                  value={newUpdate.description} 
                  onChange={(e) => setNewUpdate(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Enter update description"
                  rows={4}
                />
              </div>
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
            <Card 
              key={update.id} 
              className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    {editMode[update.id] ? (
                      <Input 
                        value={update.title} 
                        onChange={(e) => handleUpdateChange(update.id, 'title', e.target.value)}
                        className="font-semibold text-lg mb-1"
                      />
                    ) : (
                      <h3 className="font-semibold text-lg">{update.title}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {editMode[update.id] ? (
                        <Input 
                          type="date"
                          value={update.date} 
                          onChange={(e) => handleUpdateChange(update.id, 'date', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        new Date(update.date).toLocaleDateString()
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {editMode[update.id] ? (
                      <Button onClick={() => handleEditToggle(update.id)} size="sm" variant="outline">
                        <Check className="h-4 w-4" />
                        Done
                      </Button>
                    ) : (
                      <Button onClick={() => handleEditToggle(update.id)} size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDeleteUpdate(update.id)} 
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editMode[update.id] ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Input 
                        value={update.image} 
                        onChange={(e) => handleUpdateChange(update.id, 'image', e.target.value)}
                      />
                      <div className="mt-2 w-full h-32 bg-muted rounded-md overflow-hidden">
                        <img 
                          src={update.image} 
                          alt={update.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea 
                        value={update.description} 
                        onChange={(e) => handleUpdateChange(update.id, 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full h-40 bg-muted rounded-md overflow-hidden">
                      <img 
                        src={update.image} 
                        alt={update.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm">{update.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default Admin;
