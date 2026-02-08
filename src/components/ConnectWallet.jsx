import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const OWNER_ADDRESS = '0x6dA0a1784De1aBDDe1734bA37eCa3d560bf044c0';

const styles = {
  container: {
    position: 'relative',
  },
  triggerButton: {
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  triggerButtonHover: {
    borderColor: '#e53935',
  },
  triggerConnected: {
    background: 'rgba(229, 57, 53, 0.1)',
    borderColor: '#e53935',
  },
  chevron: {
    fontSize: '0.65rem',
    transition: 'transform 0.2s',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    minWidth: '200px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'fadeIn 0.15s ease-out',
  },
  dropdownHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #222',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  addressText: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: '#888',
    margin: 0,
  },
  statusDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#4caf50',
    marginRight: '8px',
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  menuItemHover: {
    background: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemDanger: {
    color: '#e53935',
  },
  menuItemAccent: {
    color: '#e53935',
  },
  divider: {
    height: '1px',
    background: '#222',
    margin: 0,
  },
};

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dropdownRef = useRef(null);

  const isOwner = isConnected && address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = () => {
    connect({ connector: injected() });
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  const triggerStyle = {
    ...styles.triggerButton,
    ...(isHovered ? styles.triggerButtonHover : {}),
    ...(isConnected ? styles.triggerConnected : {}),
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        style={triggerStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isConnected ? (
          <>
            <span style={styles.statusDot} />
            {address.slice(0, 4)}...{address.slice(-3)}
          </>
        ) : (
          'Connect'
        )}
        <span style={{ ...styles.chevron, ...(isOpen ? styles.chevronOpen : {}) }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {isConnected ? (
            <>
              <div style={styles.dropdownHeader}>
                <p style={styles.addressText}>
                  {address.slice(0, 10)}...{address.slice(-8)}
                </p>
              </div>
              
              {isOwner && (
                <>
                  <a
                    href="/dashboard"
                    style={{
                      ...styles.menuItem,
                      ...styles.menuItemAccent,
                      ...(hoveredItem === 'dashboard' ? styles.menuItemHover : {}),
                    }}
                    onMouseEnter={() => setHoveredItem('dashboard')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    📊 Dashboard
                  </a>
                  <div style={styles.divider} />
                </>
              )}

              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.menuItem,
                  ...(hoveredItem === 'explorer' ? styles.menuItemHover : {}),
                }}
                onMouseEnter={() => setHoveredItem('explorer')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                View on Explorer ↗
              </a>

              <div style={styles.divider} />

              <button
                style={{
                  ...styles.menuItem,
                  ...styles.menuItemDanger,
                  ...(hoveredItem === 'disconnect' ? styles.menuItemHover : {}),
                }}
                onMouseEnter={() => setHoveredItem('disconnect')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <button
                style={{
                  ...styles.menuItem,
                  ...(hoveredItem === 'injected' ? styles.menuItemHover : {}),
                }}
                onMouseEnter={() => setHoveredItem('injected')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleConnect}
              >
                🦊 Browser Wallet
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
