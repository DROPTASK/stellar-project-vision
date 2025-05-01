
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import TransactionItem from '../components/transactions/TransactionItem';
import AddTransactionDialog from '../components/transactions/AddTransactionDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const Investment: React.FC = () => {
  const { transactions } = useAppStore();
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false);
  const [isEarningDialogOpen, setIsEarningDialogOpen] = useState(false);
  
  const investmentTransactions = transactions.filter(t => t.type === "investment");
  const earningTransactions = transactions.filter(t => t.type === "earning");

  return (
    <div className="container mx-auto px-4 pb-24">
      <Tabs defaultValue="investment" className="mt-2">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="earning">Earning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investment" className="space-y-4">
          <Button 
            onClick={() => setIsInvestmentDialogOpen(true)}
            className="btn-gradient w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Recent Investments</h2>
            <ScrollArea className="h-[calc(100vh-240px)]">
              {investmentTransactions.length > 0 ? (
                investmentTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="glass-card p-6 text-center">
                  <p className="text-muted-foreground">No investments recorded yet</p>
                </div>
              )}
            </ScrollArea>
          </div>
          
          <AddTransactionDialog 
            isOpen={isInvestmentDialogOpen} 
            onClose={() => setIsInvestmentDialogOpen(false)}
            transactionType="investment"
          />
        </TabsContent>
        
        <TabsContent value="earning" className="space-y-4">
          <Button 
            onClick={() => setIsEarningDialogOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:opacity-90 w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Earning
          </Button>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Recent Earnings</h2>
            <ScrollArea className="h-[calc(100vh-240px)]">
              {earningTransactions.length > 0 ? (
                earningTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="glass-card p-6 text-center">
                  <p className="text-muted-foreground">No earnings recorded yet</p>
                </div>
              )}
            </ScrollArea>
          </div>
          
          <AddTransactionDialog 
            isOpen={isEarningDialogOpen} 
            onClose={() => setIsEarningDialogOpen(false)}
            transactionType="earning"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Investment;
