import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Checkbox, 
  CheckboxIndicator 
} from '@radix-ui/react-checkbox';
import { Check, Plus, Trash, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/use-mobile';

const Todo: React.FC = () => {
  const { projects, todos, addTodo, toggleTodoCompletion, removeTodo, resetDailyTodos } = useAppStore();
  const [newTask, setNewTask] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const isMobile = useIsMobile();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }
    if (!newTask.trim()) {
      toast.error('Please enter a task');
      return;
    }

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    if (!selectedProject) {
      toast.error('Invalid project selected');
      return;
    }

    addTodo({
      projectId: selectedProjectId,
      text: newTask.trim(),
      completed: false,
    });

    setNewTask('');
    toast.success('Task added successfully');
  };

  const handleResetTasks = () => {
    resetDailyTodos();
    toast.success('All tasks have been reset');
  };

  const projectTodos = todos.reduce((acc, todo) => {
    const project = projects.find(p => p.id === todo.projectId);
    if (!project) return acc;

    if (!acc[todo.projectId]) {
      acc[todo.projectId] = {
        projectName: project.name,
        projectLogo: project.logo,
        todos: [],
      };
    }
    acc[todo.projectId].todos.push(todo);
    return acc;
  }, {} as Record<string, { projectName: string; projectLogo?: string; todos: typeof todos }>);

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mx-auto px-3 sm:px-4 pb-24">
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-center text-lg sm:text-xl flex flex-col items-center">
            <div className="mb-2">Daily Tasks Progress</div>
            <div className="text-base">
              {completedTasks}/{totalTasks} Tasks Completed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-2">
            <div className="w-full relative">
              <div className="absolute left-1/2 -top-9 -translate-x-1/2 flex flex-col items-center">
                <span
                  className={`text-3xl font-bold ${
                    completionPercentage === 100
                      ? "text-green-500 animate-pulse"
                      : "text-primary"
                  }`}
                >
                  {completionPercentage}%
                </span>
                <span className="text-xs font-medium text-muted-foreground mt-1">
                  {completionPercentage === 100
                    ? "Congratulations!"
                    : "Keep going!"}
                </span>
              </div>
              <div className="relative w-full mt-8 mb-3">
                <div className="w-full rounded-full bg-muted/50 h-6 shadow-inner overflow-hidden">
                  <div
                    className={`transition-all duration-700 ease-linear h-6 rounded-full
                      ${
                        completionPercentage === 100
                          ? "bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 animate-pulse"
                          : "bg-gradient-to-r from-indigo-500 via-purple-500 to-primary animate-[pulse-glow_1.5s_infinite]"
                      }
                    `}
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleResetTasks} size="sm" variant="outline" className="flex items-center gap-1 mt-3">
            <RefreshCw size={14} /> Reset Progress
          </Button>
        </CardContent>
      </Card>

      <form onSubmit={handleAddTodo} className={`${isMobile ? 'flex flex-col' : 'flex'} gap-2 mb-6`}>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'} bg-muted/50 mb-2 sm:mb-0`}>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className={`${isMobile ? 'w-full' : 'flex-1'} flex gap-2`}>
          <Input 
            type="text"
            placeholder="Add a new task..." 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 bg-muted/50"
          />
          <Button type="submit" className="btn-gradient whitespace-nowrap">
            <Plus size={18} />
            Add
          </Button>
        </div>
      </form>

      <ScrollArea className="h-[calc(100vh-360px)]">
        {Object.entries(projectTodos).length > 0 ? (
          Object.entries(projectTodos).map(([projectId, { projectName, projectLogo, todos }]) => (
            <div key={projectId} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-md overflow-hidden bg-muted">
                  {projectLogo ? (
                    <img 
                      src={projectLogo} 
                      alt={`${projectName} logo`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                      {projectName.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold">{projectName}</h2>
              </div>
              <div className="space-y-2">
                {todos.map(todo => (
                  <div 
                    key={todo.id} 
                    className={`glass-card p-3 flex items-center justify-between ${todo.completed ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center">
                        <Checkbox 
                          id={todo.id} 
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodoCompletion(todo.id)}
                          className={`h-4 w-4 rounded border ${todo.completed ? 'bg-primary' : 'border-muted-foreground'}`}
                        >
                          {todo.completed && (
                            <CheckboxIndicator>
                              <Check className="h-3 w-3 text-white" />
                            </CheckboxIndicator>
                          )}
                        </Checkbox>
                      </div>
                      <label 
                        htmlFor={todo.id} 
                        className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => removeTodo(todo.id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-muted-foreground">No tasks added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add a task to get started</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Todo;
