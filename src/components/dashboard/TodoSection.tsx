
import React, { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/appStore';

const TodoSection: React.FC = () => {
  const { todos, projects, addTodo, toggleTodoCompletion, removeTodo } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [todoText, setTodoText] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const handleAddTodo = () => {
    if (todoText.trim()) {
      addTodo({
        text: todoText,
        projectId: selectedProjectId || '',
        completed: false,
      });
      setTodoText('');
      setSelectedProjectId('');
      setIsDialogOpen(false);
    }
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline" 
        className="h-auto py-3 backdrop-blur-sm w-full"
      >
        <CheckSquare className="h-5 w-5 mr-2" />
        Todos ({completedTodos}/{totalTodos})
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Manage Todos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="todoText">New Todo</Label>
              <Input
                id="todoText"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                placeholder="Enter todo text..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Project (Optional)</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddTodo} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current Todos</h3>
            <ScrollArea className="max-h-48">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodoCompletion(todo.id)}
                    />
                    <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTodo(todo.id)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No todos yet
                </p>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodoSection;
