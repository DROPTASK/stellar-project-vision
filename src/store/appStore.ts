
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ProjectStat, Transaction, ExploreProject, AppState, TodoItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import exploreCatalog from './exploreCatalog';
import { supabase } from '@/integrations/supabase/client';

interface AppStore extends AppState {
  addProject: (project: Omit<Project, 'id'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addProjectStat: (projectId: string, stat: ProjectStat) => void;
  removeProjectStat: (projectId: string, statIndex: number) => void;
  updateProjectStat: (projectId: string, statIndex: number, updatedStat: ProjectStat) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  addProjectFromExplore: (exploreProjectId: string, additionalDetails: Partial<Project>) => void;
  getTotalInvestment: () => number;
  getTotalEarning: () => number;
  getExpectedReturn: () => number;
  
  // Todo related functions
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  toggleTodoCompletion: (id: string) => void;
  removeTodo: (id: string) => void;
  resetDailyTodos: () => void;

  // Data sync functions
  syncToDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      projects: [],
      transactions: [],
      exploreProjects: exploreCatalog,
      todos: [],

      addProject: (project) => {
        const newProjectId = uuidv4();
        const newProject = {
          id: newProjectId,
          ...project,
          investedAmount: project.investedAmount || 0,
          expectedAmount: project.expectedAmount || 0,
          earnedAmount: project.earnedAmount || 0,
          points: project.points || 0,
          note: project.note || '',
          stats: project.stats || [],
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        return newProjectId;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) => 
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },

      removeProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },

      addProjectStat: (projectId, stat) => {
        set((state) => ({
          projects: state.projects.map((project) => 
            project.id === projectId 
              ? { 
                  ...project, 
                  stats: [...(project.stats || []), stat] 
                }
              : project
          ),
        }));
      },
      
      removeProjectStat: (projectId, statIndex) => {
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id === projectId && project.stats) {
              const updatedStats = [...project.stats];
              updatedStats.splice(statIndex, 1);
              return {
                ...project,
                stats: updatedStats,
              };
            }
            return project;
          }),
        }));
      },
      
      updateProjectStat: (projectId, statIndex, updatedStat) => {
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id === projectId && project.stats) {
              const updatedStats = [...project.stats];
              updatedStats[statIndex] = updatedStat;
              return {
                ...project,
                stats: updatedStats,
              };
            }
            return project;
          }),
        }));
      },

      addTransaction: (transaction) => {
        const newTransaction = {
          id: uuidv4(),
          date: new Date().toISOString(),
          ...transaction,
        };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
        
        // Update project stats based on transaction
        const { projectId, amount, type } = newTransaction;
        
        if (type === "investment") {
          set((state) => ({
            projects: state.projects.map((project) => 
              project.id === projectId 
                ? { ...project, investedAmount: (project.investedAmount || 0) + amount }
                : project
            ),
          }));
        } else if (type === "earning") {
          set((state) => ({
            projects: state.projects.map((project) => 
              project.id === projectId 
                ? { ...project, earnedAmount: (project.earnedAmount || 0) + amount }
                : project
            ),
          }));
        }
      },

      removeTransaction: (id) => {
        const transaction = get().transactions.find(t => t.id === id);
        
        if (transaction) {
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          }));
          
          // Update project stats
          const { projectId, amount, type } = transaction;
          
          if (type === "investment") {
            set((state) => ({
              projects: state.projects.map((project) => 
                project.id === projectId 
                  ? { ...project, investedAmount: Math.max(0, (project.investedAmount || 0) - amount) }
                  : project
              ),
            }));
          } else if (type === "earning") {
            set((state) => ({
              projects: state.projects.map((project) => 
                project.id === projectId 
                  ? { ...project, earnedAmount: Math.max(0, (project.earnedAmount || 0) - amount) }
                  : project
              ),
            }));
          }
        }
      },

      addProjectFromExplore: (exploreProjectId, additionalDetails) => {
        const exploreProject = get().exploreProjects.find(p => p.id === exploreProjectId);
        
        if (exploreProject) {
          const newProject: Project = {
            id: uuidv4(),
            name: exploreProject.name,
            logo: exploreProject.logo,
            investedAmount: additionalDetails.investedAmount || 0,
            expectedAmount: additionalDetails.expectedAmount || 0,
            earnedAmount: additionalDetails.earnedAmount || 0,
            points: additionalDetails.points || 0,
            note: additionalDetails.note || '',
            type: additionalDetails.type || '',
            isTestnet: additionalDetails.isTestnet || false,
            stats: [],
          };
          
          set((state) => ({
            projects: [...state.projects, newProject],
          }));
        }
      },

      getTotalInvestment: () => {
        return get().projects.reduce((sum, p) => sum + (p.investedAmount || 0), 0);
      },

      getTotalEarning: () => {
        return get().projects.reduce((sum, p) => sum + (p.earnedAmount || 0), 0);
      },

      getExpectedReturn: () => {
        return get().projects.reduce((sum, p) => sum + (p.expectedAmount || 0), 0);
      },

      // Todo functions
      addTodo: (todo) => {
        const newTodo = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          ...todo,
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      toggleTodoCompletion: (id) => {
        set((state) => ({
          todos: state.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },

      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter(todo => todo.id !== id),
        }));
      },

      resetDailyTodos: () => {
        set((state) => ({
          todos: state.todos.map(todo => ({ ...todo, completed: false })),
        }));
      },

      // Data sync functions
      syncToDatabase: async (userId: string) => {
        const state = get();
        
        try {
          // Upsert user data with correct field name
          const { error } = await supabase
            .from('user_data')
            .upsert({
              user_id: userId,
              projects_data: state.projects,
              transactions_data: state.transactions,
              todos_data: state.todos,
              explore_data: state.exploreProjects,
              updated_at: new Date().toISOString()
            });

          if (error) throw error;

          // Update totals in profile
          await supabase.rpc('sync_user_totals', { p_user_id: userId });
        } catch (error) {
          console.error('Error syncing to database:', error);
          throw error;
        }
      },

      loadFromDatabase: async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          if (data) {
            // Safe type checking and conversion
            const projects = Array.isArray(data.projects_data) 
              ? data.projects_data as unknown as Project[]
              : [];
            
            const transactions = Array.isArray(data.transactions_data) 
              ? data.transactions_data as unknown as Transaction[]
              : [];
            
            const todos = Array.isArray(data.todos_data) 
              ? data.todos_data as unknown as TodoItem[]
              : [];
            
            const exploreProjects = Array.isArray(data.explore_data) 
              ? data.explore_data as unknown as ExploreProject[]
              : exploreCatalog;

            set({
              projects,
              transactions,
              todos,
              exploreProjects,
            });
          }
        } catch (error) {
          console.error('Error loading from database:', error);
          throw error;
        }
      },

      clearAllData: async () => {
        set({
          projects: [],
          transactions: [],
          todos: [],
          exploreProjects: exploreCatalog,
        });
      },
    }),
    {
      name: 'crypto-tracking-app',
    }
  )
);
