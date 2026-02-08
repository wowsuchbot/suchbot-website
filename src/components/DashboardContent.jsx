import React, { useEffect, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, base, optimism } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { useAccount } from 'wagmi';

const OWNER_ADDRESS = '0x6dA0a1784De1aBDDe1734bA37eCa3d560bf044c0';

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

const styles = {
  container: {
    paddingTop: '2rem',
  },
  accessDenied: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#888',
  },
  accessDeniedTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#fff',
  },
  header: {
    borderBottom: '1px solid #222',
    paddingBottom: '2rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    color: '#888',
    margin: 0,
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#888',
    margin: '0 0 0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
    color: '#fff',
  },
  cardSubtext: {
    fontSize: '0.875rem',
    color: '#666',
    margin: '0.5rem 0 0',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  listItem: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listLabel: {
    color: '#fff',
    fontWeight: '500',
  },
  listValue: {
    color: '#888',
    fontFamily: 'monospace',
  },
  badge: {
    background: 'rgba(229, 57, 53, 0.2)',
    color: '#e53935',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  badgeGreen: {
    background: 'rgba(76, 175, 80, 0.2)',
    color: '#4caf50',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
};

function DashboardInner() {
  const { address, isConnected } = useAccount();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = isConnected && address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  useEffect(() => {
    if (isOwner) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          setNotifications(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isOwner]);

  if (!isConnected) {
    return (
      <div style={styles.accessDenied}>
        <h2 style={styles.accessDeniedTitle}>Connect Wallet</h2>
        <p>Please connect your wallet to access the dashboard.</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div style={styles.accessDenied}>
        <h2 style={styles.accessDeniedTitle}>Access Denied</h2>
        <p>This dashboard is only accessible to the owner.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Welcome back, mxjxn</p>
      </header>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Notifications</h3>
          <p style={styles.cardValue}>{loading ? '...' : notifications.length}</p>
          <p style={styles.cardSubtext}>Pending messages</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Agent Status</h3>
          <p style={styles.cardValue}>
            <span style={styles.badgeGreen}>Online</span>
          </p>
          <p style={styles.cardSubtext}>Suchbot #2243</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Connected As</h3>
          <p style={{ ...styles.cardValue, fontSize: '1rem', fontFamily: 'monospace' }}>
            {address.slice(0, 10)}...{address.slice(-8)}
          </p>
          <p style={styles.cardSubtext}>Owner wallet</p>
        </div>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Notifications</h2>
        {loading ? (
          <div style={styles.listItem}>
            <span style={styles.listLabel}>Loading...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div style={styles.listItem}>
            <span style={{ color: '#666' }}>No pending notifications</span>
          </div>
        ) : (
          notifications.slice(0, 10).map((n, i) => (
            <div key={i} style={styles.listItem}>
              <span style={styles.listLabel}>{n.data?.message || n.message || n.title || 'Notification'}</span>
              <span style={styles.badge}>New</span>
            </div>
          ))
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Links</h2>
        <div style={styles.listItem}>
          <span style={styles.listLabel}>Agent Registry</span>
          <a href="https://www.8004scan.io/agent/2243" target="_blank" style={{ color: '#e53935' }}>
            View on 8004scan →
          </a>
        </div>
        <div style={styles.listItem}>
          <span style={styles.listLabel}>Agent Wallet</span>
          <a href="https://basescan.org/address/0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A" target="_blank" style={{ color: '#e53935' }}>
            View on Basescan →
          </a>
        </div>
        <div style={styles.listItem}>
          <span style={styles.listLabel}>Blog</span>
          <a href="/blog" style={{ color: '#e53935' }}>Manage posts →</a>
        </div>
      </section>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DashboardInner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
