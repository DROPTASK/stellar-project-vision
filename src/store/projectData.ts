
import { Project } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Demo projects data
export const projects: Project[] = [
  {
    id: uuidv4(),
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    investedAmount: 1500,
    expectedAmount: 2500,
    earnedAmount: 0,
    type: "mainnet",
    stats: [
      { amount: 1500, type: "investment" }
    ]
  },
  {
    id: uuidv4(),
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    investedAmount: 800,
    expectedAmount: 1600,
    earnedAmount: 100,
    type: "mainnet",
    stats: [
      { amount: 800, type: "investment" },
      { amount: 100, type: "earning" }
    ]
  },
  {
    id: uuidv4(),
    name: "Aptos Testnet",
    logo: "https://cryptologos.cc/logos/aptos-apt-logo.png",
    investedAmount: 0,
    expectedAmount: 0,
    earnedAmount: 0,
    type: "testnet",
    isTestnet: true,
    stats: []
  }
];
