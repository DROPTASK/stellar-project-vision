
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Transaction, ExploreProject, AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import exploreCatalog from './exploreCatalog';

interface AppStore extends AppState {
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  addProjectFromExplore: (exploreProjectId: string, additionalDetails: Partial<Project>) => void;
  getTotalInvestment: () => number;
  getTotalEarning: () => number;
  getExpectedReturn: () => number;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      projects: [],
      transactions: [],
      exploreProjects: exploreCatalog,

      addProject: (project) => {
        const newProject = {
          id: uuidv4(),
          ...project,
          investedAmount: project.investedAmount || 0,
          expectedAmount: project.expectedAmount || 0,
          earnedAmount: project.earnedAmount || 0,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
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
            type: additionalDetails.type || '',
            isTestnet: additionalDetails.isTestnet || false,
          };
          
          set((state) => ({
            projects: [...state.projects, newProject],
          }));
        }
      },

      getTotalInvestment: () => {
        return get().transactions
          .filter(t => t.type === "investment")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalEarning: () => {
        return get().transactions
          .filter(t => t.type === "earning")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getExpectedReturn: () => {
        return get().projects.reduce((sum, p) => sum + (p.expectedAmount || 0), 0);
      },
    }),
    {
      name: 'crypto-tracking-app',
    }
  )
);
