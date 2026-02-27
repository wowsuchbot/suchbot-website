import React, { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { sdk } from '@farcaster/miniapp-sdk';

const SERVICE_RECEIVER = '0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A'; // suchbot wallet

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#888',
  },
  textarea: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: '#fff',
    width: '100%',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: '1.5',
  },
  textareaFocus: {
    outline: 'none',
    borderColor: '#ff6b35',
  },
  button: {
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
    width: '100%',
  },
  buttonDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  buttonHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
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
  infoText: {
    fontSize: '0.75rem',
    color: '#666',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
};

export default function ServicePayment({ serviceId, serviceName, price }) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [projectDetails, setProjectDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  // Check if running in Mini App context
  React.useEffect(() => {
    const checkMiniApp = async () => {
      try {
        await sdk.actions.ready();
        setIsMiniApp(true);
      } catch (e) {
        setIsMiniApp(false);
      }
    };
    checkMiniApp();
  }, []);

  const handlePay = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!projectDetails.trim()) {
      setError('Please describe your project or requirements');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setTxHash(null);

    try {
      // Encode service details in transaction data
      const message = JSON.stringify({
        service: serviceId,
        name: serviceName,
        details: projectDetails,
        timestamp: new Date().toISOString(),
      });
      const data = `0x${Buffer.from(message).toString('hex')}`;

      if (isMiniApp) {
        // Use Mini App SDK for in-app transactions
        await sdk.wallet.sendTransaction({
          to: SERVICE_RECEIVER,
          value: parseEther(price),
          data: data,
        });
      } else {
        // Use Wagmi for external wallet transactions
        if (!walletClient) {
          throw new Error('Wallet client not available');
        }

        const hash = await walletClient.sendTransaction({
          to: SERVICE_RECEIVER,
          value: parseEther(price),
          data: data,
          chain: { id: 8453 }, // Base chain
        });

        setTxHash(hash);
      }
    } catch (err) {
      console.error('Service payment failed:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Project Details</div>
      
      {txHash ? (
        <div style={styles.successMessage}>
          ✓ Payment successful! Your service request has been received.
          <div style={{ marginTop: '0.5rem' }}>
            <a 
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4caf50', textDecoration: 'underline' }}
            >
              View transaction
            </a>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
            We'll contact you shortly to confirm requirements and timeline.
          </div>
        </div>
      ) : error ? (
        <div style={styles.errorMessage}>
          ✗ {error}
        </div>
      ) : null}

      <textarea
        style={styles.textarea}
        value={projectDetails}
        onChange={(e) => setProjectDetails(e.target.value)}
        placeholder="Describe your project, requirements, or goals... (e.g., 'Need research on emerging artist @username for potential feature. Include portfolio analysis and market positioning.')"
        maxLength={1000}
        disabled={txHash !== null}
      />
      
      <button
        style={{
          ...styles.button,
          ...(isSubmitting ? styles.buttonDisabled : {}),
        }}
        onClick={handlePay}
        disabled={isSubmitting || txHash !== null}
      >
        {isSubmitting ? (
          <>
            <span>⏳</span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>💳</span>
            <span>Pay {price} ETH</span>
          </>
        )}
      </button>
      
      {!txHash && (
        <div style={styles.infoText}>
          Transaction will be executed on Base network. Your project details will be included in the transaction data.
        </div>
      )}
    </div>
  );
}
