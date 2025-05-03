
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { projects as demoProjects } from './projectData';
import exploreCatalog from './exploreCatalog';
import { Project, Transaction, TodoItem, ExploreProject } from '../types';

interface Profile {
  id: string;
  name: string;
  walletAddress?: string;
  email?: string;
  socialAccount?: string;
  createdAt: string;
}

interface AppState {
  projects: Project[];
  transactions: Transaction[];
  todoItems: TodoItem[];
  exploreProjects: ExploreProject[];
  
  // Profile management
  profiles: Profile[];
  currentProfile: Profile | null;
  isProfileModalOpen: boolean;
  
  // Utility functions
  getTotalInvestment: () => number;
  getTotalEarning: () => number;
  getExpectedReturn: () => number;
  addProjectStat: (projectId: string, amount: number, type: string) => void;
  addProjectFromExplore: (exploreProject: ExploreProject) => void;
  
  // Actions for projects
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  
  // Actions for transactions
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  
  // Actions for todo items
  addTodoItem: (item: TodoItem) => void;
  updateTodoItem: (item: TodoItem) => void;
  removeTodoItem: (id: string) => void;
  
  // Actions for profiles
  initializeProfiles: () => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profile: Profile) => void;
  removeProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  showProfileModal: () => void;
  hideProfileModal: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        projects: [...demoProjects],
        transactions: [],
        todoItems: [],
        exploreProjects: [...exploreCatalog],
        
        // Profile state
        profiles: [],
        currentProfile: null,
        isProfileModalOpen: false,
        
        // Utility functions
        getTotalInvestment: () => {
          return get().projects.reduce((total, project) => total + (project.investedAmount || 0), 0);
        },
        
        getTotalEarning: () => {
          return get().projects.reduce((total, project) => total + (project.earnedAmount || 0), 0);
        },
        
        getExpectedReturn: () => {
          return get().projects.reduce((total, project) => total + (project.expectedAmount || 0), 0);
        },
        
        addProjectStat: (projectId, amount, type) => {
          const projects = get().projects;
          const projectIndex = projects.findIndex(p => p.id === projectId);
          
          if (projectIndex !== -1) {
            const project = { ...projects[projectIndex] };
            
            // Initialize stats array if it doesn't exist
            if (!project.stats) {
              project.stats = [];
            }
            
            // Add new stat
            project.stats.push({ amount, type });
            
            // Update project amounts based on stat type
            if (type === 'investment') {
              project.investedAmount = (project.investedAmount || 0) + amount;
            } else if (type === 'earning') {
              project.earnedAmount = (project.earnedAmount || 0) + amount;
            }
            
            // Update project in store
            set({
              projects: [
                ...projects.slice(0, projectIndex),
                project,
                ...projects.slice(projectIndex + 1)
              ]
            });
          }
        },
        
        addProjectFromExplore: (exploreProject) => {
          const newProject: Project = {
            id: uuidv4(),
            name: exploreProject.name,
            logo: exploreProject.logo,
            investedAmount: 0,
            expectedAmount: 0,
            earnedAmount: 0,
            type: 'mainnet',
            stats: []
          };
          
          set((state) => ({
            projects: [...state.projects, newProject]
          }));
          
          return newProject.id;
        },
        
        // Project actions
        addProject: (project: Project) => set((state) => ({ 
          projects: [...state.projects, project] 
        })),
        
        updateProject: (project: Project) => set((state) => ({ 
          projects: state.projects.map((p) => p.id === project.id ? project : p) 
        })),
        
        removeProject: (id: string) => set((state) => ({ 
          projects: state.projects.filter((p) => p.id !== id) 
        })),
        
        // Transaction actions
        addTransaction: (transaction: Transaction) => set((state) => ({ 
          transactions: [...state.transactions, transaction] 
        })),
        
        removeTransaction: (id: string) => set((state) => ({ 
          transactions: state.transactions.filter((t) => t.id !== id) 
        })),
        
        // Todo actions
        addTodoItem: (item: TodoItem) => set((state) => ({ 
          todoItems: [...state.todoItems, item] 
        })),
        
        updateTodoItem: (item: TodoItem) => set((state) => ({ 
          todoItems: state.todoItems.map((t) => t.id === item.id ? item : t) 
        })),
        
        removeTodoItem: (id: string) => set((state) => ({ 
          todoItems: state.todoItems.filter((t) => t.id !== id) 
        })),
        
        // Profile actions
        initializeProfiles: () => set((state) => {
          // If there are no profiles, create a default one
          if (state.profiles.length === 0) {
            const defaultProfile: Profile = {
              id: uuidv4(),
              name: 'Default',
              createdAt: new Date().toISOString()
            };
            
            return {
              profiles: [defaultProfile],
              currentProfile: defaultProfile
            };
          }
          
          // If there are profiles but no current profile is set, use the first one
          if (state.profiles.length > 0 && !state.currentProfile) {
            return { currentProfile: state.profiles[0] };
          }
          
          return {};
        }),
        
        addProfile: (profile: Profile) => set((state) => {
          const newProfiles = [...state.profiles, profile];
          return {
            profiles: newProfiles,
            currentProfile: profile // Switch to the new profile
          };
        }),
        
        updateProfile: (profile: Profile) => set((state) => ({
          profiles: state.profiles.map((p) => p.id === profile.id ? profile : p),
          currentProfile: state.currentProfile?.id === profile.id ? profile : state.currentProfile
        })),
        
        removeProfile: (id: string) => set((state) => {
          // Don't allow removing the last profile
          if (state.profiles.length <= 1) {
            return {};
          }
          
          const newProfiles = state.profiles.filter((p) => p.id !== id);
          
          // If the current profile is being removed, switch to another one
          let newCurrentProfile = state.currentProfile;
          if (state.currentProfile?.id === id) {
            newCurrentProfile = newProfiles[0];
          }
          
          return {
            profiles: newProfiles,
            currentProfile: newCurrentProfile
          };
        }),
        
        switchProfile: (id: string) => set((state) => {
          const profile = state.profiles.find((p) => p.id === id);
          if (profile) {
            return { currentProfile: profile };
          }
          return {};
        }),
        
        showProfileModal: () => set({ isProfileModalOpen: true }),
        hideProfileModal: () => set({ isProfileModalOpen: false })
      }),
      {
        name: 'crypto-projects-storage',
        partialize: (state) => ({
          projects: state.projects,
          transactions: state.transactions,
          todoItems: state.todoItems,
          profiles: state.profiles,
          currentProfile: state.currentProfile
        })
      }
    )
  )
);
