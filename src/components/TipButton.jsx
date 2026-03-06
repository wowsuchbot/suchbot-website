import React, { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { sdk } from '@farcaster/miniapp-sdk';

const TIP_AMOUNT = '0.01'; // ETH
const TIP_RECEIVER = '0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A'; // suchbot wallet
const TIP_OPTIONS = ['0.005', '0.01', '0.025', '0.05', '0.1'];

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.75rem',
    background: 'rgba(255, 107, 53, 0.02)',
    border: '1px solid rgba(255, 107, 53, 0.1)',
    borderRadius: '6px',
  },
  header: {
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0 0 0.5rem',
    color: '#fff',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#888',
    margin: 0,
  },
  amountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '0.5rem',
  },
  amountButton: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  amountButtonSelected: {
    background: 'rgba(255, 107, 53, 0.2)',
    borderColor: '#ff6b35',
  },
  amountButtonHover: {
    borderColor: '#ff6b35',
    background: 'rgba(255, 107, 53, 0.1)',
  },
  mainButton: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #e53935 100%)',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  mainButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  mainButtonHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
  },
  message: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: '#fff',
    width: '100%',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  messageFocus: {
    outline: 'none',
    borderColor: '#ff6b35',
  },
  successMessage: {
    background: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid #4caf50',
    borderRadius: '8px',
    padding: '1rem',
    color: '#4caf50',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  errorMessage: {
    background: 'rgba(229, 57, 53, 0.1)',
    border: '1px solid #e53935',
    borderRadius: '8px',
    padding: '1rem',
    color: '#e53935',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  loading: {
    color: '#888',
    fontSize: '0.875rem',
  },
};

export default function TipButton() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [selectedAmount, setSelectedAmount] = useState(TIP_AMOUNT);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  // Check if running in Mini App context
  React.useEffect(() => {
    const checkMiniApp = async () => {
      try {
        // Add timeout to prevent blocking if SDK fails to respond
        await Promise.race([
          sdk.actions.ready(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('SDK ready timeout')), 1000)
          )
        ]);
        setIsMiniApp(true);
      } catch (e) {
        // Not in Mini App context or timeout - treat as web
        setIsMiniApp(false);
      }
    };
    checkMiniApp();
  }, []);

  const handleTip = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setTxHash(null);

    try {
      if (isMiniApp) {
        // Use Mini App SDK for in-app transactions
        await sdk.wallet.sendTransaction({
          to: TIP_RECEIVER,
          value: parseEther(selectedAmount),
          data: message ? `0x${Buffer.from(message).toString('hex')}` : '0x',
        });
      } else {
        // Use Wagmi for external wallet transactions
        if (!walletClient) {
          throw new Error('Wallet client not available');
        }

        const hash = await walletClient.sendTransaction({
          to: TIP_RECEIVER,
          value: parseEther(selectedAmount),
          data: message ? `0x${Buffer.from(message).toString('hex')}` : '0x',
          chain: { id: 8453 }, // Base chain
        });

        setTxHash(hash);
      }
    } catch (err) {
      console.error('Tip transaction failed:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>💜 Tip suchbot</h3>
        <p style={styles.subtitle}>
          Support the work that goes into building tools for cryptoart and beyond.
        </p>
      </div>

      {txHash ? (
        <div style={styles.successMessage}>
          ✓ Tip sent successfully! 
          <a 
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4caf50', textDecoration: 'underline', marginLeft: '0.5rem' }}
          >
            View transaction
          </a>
        </div>
      ) : error ? (
        <div style={styles.errorMessage}>
          ✗ {error}
        </div>
      ) : null}

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>
          Select amount (ETH):
        </label>
        <div style={styles.amountGrid}>
          {TIP_OPTIONS.map((amount) => (
            <button
              key={amount}
              style={{
                ...styles.amountButton,
                ...(selectedAmount === amount ? styles.amountButtonSelected : {}),
              }}
              onClick={() => setSelectedAmount(amount)}
              onMouseEnter={(e) => {
                if (selectedAmount !== amount) {
                  e.currentTarget.style = { ...styles.amountButton, ...styles.amountButtonHover };
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAmount !== amount) {
                  e.currentTarget.style = styles.amountButton;
                }
              }}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>
          Add a message (optional):
        </label>
        <textarea
          style={styles.message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Thanks for the help!"
          maxLength={280}
        />
      </div>

      <button
        style={{
          ...styles.mainButton,
          ...(isSubmitting ? styles.mainButtonDisabled : {}),
        }}
        onClick={handleTip}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span>⏳</span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>💜</span>
            <span>Send {selectedAmount} ETH</span>
          </>
        )}
      </button>

      <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
        Transaction will be executed on Base network
      </div>
    </div>
  );
}
