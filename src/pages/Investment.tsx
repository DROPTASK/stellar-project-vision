
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import TransactionItem from '../components/transactions/TransactionItem';
import AddTransactionDialog from '../components/transactions/AddTransactionDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Investment: React.FC = () => {
  const { transactions, getTotalInvestment, getTotalEarning } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"investment" | "earning">("investment");
  const [currentTab, setCurrentTab] = useState<"investment" | "earning">("investment");
  
  const totalInvestment = getTotalInvestment();
  const totalEarning = getTotalEarning();

  const handleOpenAddDialog = (type: "investment" | "earning") => {
    setTransactionType(type);
    setIsAddDialogOpen(true);
  };

  const handleTabChange = (value: string) => {
    if (value === "investment" || value === "earning") {
      setCurrentTab(value);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Total Investment: ${totalInvestment.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Total Earnings: ${totalEarning.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          onClick={() => handleOpenAddDialog("investment")}
          className="btn-gradient"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
        
        <Button 
          onClick={() => handleOpenAddDialog("earning")}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Earning
        </Button>
      </div>
      
      <Tabs defaultValue="investment" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="investment">Investment Transactions</TabsTrigger>
          <TabsTrigger value="earning">Earning Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investment" className="space-y-4">
          <h2 className="text-lg font-semibold mb-3">Recent Investments</h2>
          <ScrollArea className="h-[calc(100vh-420px)]">
            {transactions.filter(t => t.type === "investment").length > 0 ? (
              transactions
                .filter(t => t.type === "investment")
                .map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">No investments recorded yet</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="earning" className="space-y-4">
          <h2 className="text-lg font-semibold mb-3">Recent Earnings</h2>
          <ScrollArea className="h-[calc(100vh-420px)]">
            {transactions.filter(t => t.type === "earning").length > 0 ? (
              transactions
                .filter(t => t.type === "earning")
                .map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">No earnings recorded yet</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <AddTransactionDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        transactionType={transactionType}
      />
    </div>
  );
};

export default Investment;
