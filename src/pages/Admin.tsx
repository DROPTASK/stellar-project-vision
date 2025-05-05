
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

const Admin: React.FC = () => {
  const { theme } = useTheme();
  const { exploreProjects } = useAppStore();
  const [projects, setProjects] = useState<ExploreProject[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [newProject, setNewProject] = useState<ExploreProject>({
    id: uuidv4(),
    name: '',
    logo: '',
    tags: [],
    description: ''
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setProjects([...exploreProjects]);
  }, [exploreProjects]);

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
    const project = projects.find(p => p.id === id);
    if (project && newTag.trim()) {
      handleTagChange(id, [...(project.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (id: string, tagIndex: number) => {
    const project = projects.find(p => p.id === id);
    if (project && project.tags) {
      const newTags = [...project.tags];
      newTags.splice(tagIndex, 1);
      handleTagChange(id, newTags);
    }
  };

  const handleSaveChanges = () => {
    // This would connect to the GitHub repository and save changes
    // For now, let's just show a toast notification
    toast({
      title: "Changes saved",
      description: "Your changes have been submitted to the GitHub repository",
    });
  };

  const handleAddProject = () => {
    if (newProject.name && newProject.logo) {
      setProjects(prev => [...prev, { ...newProject, id: uuidv4() }]);
      setNewProject({
        id: uuidv4(),
        name: '',
        logo: '',
        tags: [],
        description: ''
      });
      setShowNewProjectForm(false);
      toast({
        title: "Project added",
        description: "The new project has been added to the list",
      });
    } else {
      toast({
        title: "Error",
        description: "Project name and logo are required",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    toast({
      title: "Project deleted",
      description: "The project has been removed from the list",
    });
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

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold">Admin CMS Dashboard</h1>
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

        <ScrollArea className="h-[calc(100vh-200px)]">
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
      </div>
    </div>
  );
};

export default Admin;
