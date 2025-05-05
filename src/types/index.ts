
export interface Project {
  id: string;
  name: string;
  logo?: string;
  investedAmount?: number;
  expectedAmount?: number;
  earnedAmount?: number;
  points?: number;  // Points field
  note?: string;    // Note/achievements field
  type?: string;
  isTestnet?: boolean;
  stats?: ProjectStat[];
}

export interface ProjectStat {
  amount: number;
  type: string;
}

export interface ExploreProject {
  id: string;
  name: string;
  logo: string;
  tags: string[];
  funding?: string;
  reward?: string;
  tge?: string;
  description?: string;
  hydraLink?: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo?: string;
  amount: number;
  date: string;
  type: "investment" | "earning";
}

export interface TodoItem {
  id: string;
  projectId: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface AppState {
  projects: Project[];
  transactions: Transaction[];
  exploreProjects: ExploreProject[];
  todos: TodoItem[];
}
