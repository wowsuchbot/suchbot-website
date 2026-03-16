import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const styles = {
  button: {
    background: 'transparent',
    color: '#888888',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'Inter, sans-serif',
  },
  connected: {
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  icon: {
    width: '16px',
    height: '16px',
  }
};

function WalletButtonInner() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: injected() });
    }
  };

  if (isConnected && address) {
    return (
      <button
        onClick={handleClick}
        style={{ ...styles.button, ...styles.connected }}
      >
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
          <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
        </svg>
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      style={styles.button}
      disabled={isPending}
    >
      <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      </svg>
      {isPending ? 'Connecting...' : 'Connect'}
    </button>
  );
}

export default function WalletButton() {
  // Only render on client to avoid SSR issues
  if (typeof window === 'undefined') {
    return (
      <button style={styles.button} disabled>
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
          <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
        </svg>
        Connect
      </button>
    );
  }
  return <WalletButtonInner />;
}
