import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, base, optimism } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { ConnectWallet } from './ConnectWallet.jsx';

const config = createConfig({
  chains: [mainnet, base, optimism],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Web3Provider() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
