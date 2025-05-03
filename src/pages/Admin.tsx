
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, TrashIcon, Save, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { ExploreProject } from '../types';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

interface FormData {
  name: string;
  description: string;
  logo?: string;
  funding?: string;
  reward?: string;
  tge?: string;
  tags: string[];
  url?: string;
}

const Admin: React.FC = () => {
  const [githubToken, setGithubToken] = useState('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');
  const [projects, setProjects] = useState<ExploreProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<ExploreProject | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    logo: '',
    funding: '',
    reward: '',
    tge: '',
    tags: [],
    url: '',
  });
  const [tagInput, setTagInput] = useState('');
  
  const navigate = useNavigate();
  
  // Verify admin access
  useEffect(() => {
    // Check if admin access was granted
    const hasAccess = sessionStorage.getItem('adminAccess');
    if (!hasAccess) {
      navigate('/support');
      toast.error('Admin access denied');
    }
  }, [navigate]);
  
  // Load projects from GitHub
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Fetch explore projects configuration from Github (mock for now)
      // In a real implementation, this would fetch the data from Github
      
      // Simulate API call with a timeout
      setTimeout(() => {
        // For now, we'll use the data from the store or static data
        import('../store/exploreCatalog').then(module => {
          setProjects(module.exploreProjects);
          setIsLoading(false);
        });
      }, 1000);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, tagInput.trim()] 
      }));
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const handleEditProject = (project: ExploreProject) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      logo: project.logo,
      funding: project.funding,
      reward: project.reward,
      tge: project.tge,
      tags: [...project.tags],
      url: project.url,
    });
    setIsEditing(true);
  };
  
  const handleCreateProject = () => {
    setCurrentProject(null);
    setFormData({
      name: '',
      description: '',
      logo: '',
      funding: '',
      reward: '',
      tge: '',
      tags: [],
      url: '',
    });
    setIsEditing(true);
  };
  
  const handleDeleteProject = async (project: ExploreProject) => {
    if (!window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, this would delete the project from Github
      
      // For now, just remove it from the local state
      setProjects(prev => prev.filter(p => p.id !== project.id));
      toast.success(`${project.name} deleted successfully`);
      
      // Simulate API call success
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      setIsLoading(false);
    }
  };
  
  const handleSaveProject = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Name and description are required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, this would save to Github
      
      // For now, update the local state
      if (currentProject) {
        // Update existing project
        const updatedProjects = projects.map(p => 
          p.id === currentProject.id ? { ...currentProject, ...formData } : p
        );
        setProjects(updatedProjects);
        toast.success(`${formData.name} updated successfully`);
      } else {
        // Create new project
        const newProject: ExploreProject = {
          id: Date.now().toString(),
          ...formData,
        };
        setProjects([...projects, newProject]);
        toast.success(`${formData.name} created successfully`);
      }
      
      // Close the dialog
      setIsEditing(false);
      setCurrentProject(null);
      
      // Simulate API call success
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
      setIsLoading(false);
    }
  };
  
  const commitChangesToGithub = async () => {
    setIsLoading(true);
    toast.info('Committing changes to GitHub...');
    
    try {
      // In a real implementation, this would commit the changes to Github
      // using the Github API
      
      // Simulate API call with a timeout
      setTimeout(() => {
        toast.success('Changes committed to GitHub successfully');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error committing to GitHub:', error);
      toast.error('Failed to commit changes to GitHub');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 pb-24">
      <Card className="glass-card mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display">
              CMS - Explore Projects
            </CardTitle>
            <CardDescription>
              Manage projects in the Explore tab
            </CardDescription>
          </div>
          <Button onClick={handleCreateProject} className="btn-gradient">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin opacity-50" />
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  className="mb-4 p-4 glass-card hover:ring-1 hover:ring-accent/50 transition-all"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                        {project.logo ? (
                          <img 
                            src={project.logo} 
                            alt={project.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-indigo-700">
                            {project.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Funding</p>
                      <p>{project.funding || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reward</p>
                      <p>{project.reward || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">TGE</p>
                      <p>{project.tge || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="githubToken">GitHub Token</Label>
            <Input 
              id="githubToken" 
              value={githubToken} 
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-80"
              type="password"
            />
          </div>
          <Button 
            disabled={isLoading || !githubToken} 
            onClick={commitChangesToGithub}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Commit Changes to GitHub
          </Button>
        </CardFooter>
      </Card>

      {/* Edit/Create Project Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !isLoading && setIsEditing(open)}>
        <DialogContent className="glass-card border-accent/50 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display">
              {currentProject ? `Edit ${currentProject.name}` : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Project name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Project description"
                  required
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="funding">Funding</Label>
                  <Input
                    id="funding"
                    name="funding"
                    value={formData.funding || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. $10M"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reward">Reward</Label>
                  <Input
                    id="reward"
                    name="reward"
                    value={formData.reward || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Airdrop"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tge">TGE</Label>
                  <Input
                    id="tge"
                    name="tge"
                    value={formData.tge || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Q2 2025"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Project URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, i) => (
                    <div
                      key={i}
                      className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-primary-foreground/70 hover:text-primary-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProject} 
              disabled={isLoading || !formData.name || !formData.description}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {currentProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
