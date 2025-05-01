
export interface Project {
  id: string;
  name: string;
  logo?: string;
  investedAmount?: number;
  expectedAmount?: number;
  earnedAmount?: number;
  type?: string;
  isTestnet?: boolean;
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

export interface AppState {
  projects: Project[];
  transactions: Transaction[];
  exploreProjects: ExploreProject[];
}
