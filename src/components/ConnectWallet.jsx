import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const OWNER_ADDRESS = '0x6dA0a1784De1aBDDe1734bA37eCa3d560bf044c0';

const buttonStyle = {
  background: 'transparent',
  border: '1px solid #333',
  borderRadius: '4px',
  color: '#fff',
  padding: '8px 16px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
};

const buttonHoverStyle = {
  borderColor: '#e53935',
  color: '#e53935',
};

const addressStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const addressTextStyle = {
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  color: '#888',
};

const dashboardLinkStyle = {
  color: '#e53935',
  fontSize: '0.875rem',
  fontWeight: '500',
  textDecoration: 'none',
  padding: '8px 12px',
  border: '1px solid #e53935',
  borderRadius: '4px',
  transition: 'all 0.2s',
};

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isHovered, setIsHovered] = React.useState(false);
  const [dashHovered, setDashHovered] = React.useState(false);

  const isOwner = isConnected && address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  if (isConnected) {
    return (
      <div style={addressStyle}>
        {isOwner && (
          <a 
            href="/dashboard" 
            style={{
              ...dashboardLinkStyle,
              background: dashHovered ? '#e53935' : 'transparent',
              color: dashHovered ? '#000' : '#e53935',
            }}
            onMouseEnter={() => setDashHovered(true)}
            onMouseLeave={() => setDashHovered(false)}
          >
            Dashboard
          </a>
        )}
        <span style={addressTextStyle}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button 
          style={{
            ...buttonStyle,
            ...(isHovered ? buttonHoverStyle : {})
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      style={{
        ...buttonStyle,
        ...(isHovered ? buttonHoverStyle : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => connect({ connector: injected() })}
    >
      Connect
    </button>
  );
}
