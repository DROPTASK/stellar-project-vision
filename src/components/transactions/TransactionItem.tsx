
import React from 'react';
import { Transaction } from '../../types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { toast } from 'sonner';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { removeTransaction } = useAppStore();
  const formattedDate = new Date(transaction.date).toLocaleDateString();

  const handleDelete = () => {
    removeTransaction(transaction.id);
    toast.success('Transaction removed successfully');
  };

  return (
    <div className="flex justify-between items-center p-3 glass-card my-2">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted mr-3">
          {transaction.projectLogo ? (
            <img 
              src={transaction.projectLogo} 
              alt={`${transaction.projectName} logo`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
              {transaction.projectName.charAt(0)}
            </div>
          )}
        </div>
        
        <div>
          <p className="font-medium">{transaction.projectName}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <p className={`mr-4 font-semibold ${transaction.type === 'earning' ? 'text-green-500' : ''}`}>
          {transaction.type === 'earning' ? '+' : '-'}${transaction.amount}
        </p>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDelete} 
          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TransactionItem;
