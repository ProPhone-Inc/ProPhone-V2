import React, { useState } from 'react';
import { TransactionsView } from './TransactionsView';

interface DocumentSystemProps {
  defaultView?: string;
  onPageChange: (page: string) => void;
}

export function DocumentSystem({ defaultView = 'transactions', onPageChange }: DocumentSystemProps) {
  React.useEffect(() => {
    // Set initial view to transactions
    if (defaultView === 'transactions') {
      onPageChange('docupro-transactions');
    }
  }, [defaultView, onPageChange]);

  return <TransactionsView />;
}