import React from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const styles = {
  container: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    background: '#8B5CF6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  buttonSecondary: {
    background: '#1a1a1a',
    color: '#e5e5e5',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  disconnect: {
    background: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export function ConnectWallet() {
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div style={styles.container}>
      <button
        style={styles.button}
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
      >
        {isPending ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      <button
        style={styles.buttonSecondary}
        onClick={() => connect({ connector: coinbaseWallet({ app: { name: 'Suchbot Dashboard' } }) })}
        disabled={isPending}
      >
        Connect Coinbase
      </button>
    </div>
  );
}

export function DisconnectButton({ onClick }) {
  const { disconnect } = useDisconnect();

  return (
    <button style={styles.disconnect} onClick={onClick || (() => disconnect())}>
      Disconnect
    </button>
  );
}
