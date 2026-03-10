import React from 'react';
import { WagmiConfig } from './WagmiProvider';
import DashboardContent from './DashboardContent';

export default function DashboardWrapped() {
  return (
    <WagmiConfig>
      <DashboardContent />
    </WagmiConfig>
  );
}
