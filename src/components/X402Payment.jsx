import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Web3Provider from './Web3Provider.jsx';

const DEMO_API = '/api/x402-demo'; // Local x402 endpoint

export default function X402Payment({ price, description, serviceName }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const handleX402Payment = async (address) => {
    try {
      setStatus('processing');
      setError(null);
      setPaymentResponse(null);

      // Demo: simulate x402 payment flow
      // In production, this would use the x402 fetch wrapper:
      //
      // import { wrapFetchWithPaymentFromConfig } from '@x402/fetch';
      // import { ExactEvmScheme } from '@x402/evm';
      //
      // const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
      //   schemes: [{
      //     network: 'eip155:8453',
      //     client: new ExactEvmScheme(walletSigner),
      //   }],
      // });
      //
      // const response = await fetchWithPayment(DEMO_API);
      // const data = await response.json();

      // Step 1: Initial request (would return 402 Payment Required)
      console.log('Step 1: Requesting protected resource...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Create payment payload (simulated)
      console.log('Step 2: Creating payment payload...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Submit with PAYMENT-SIGNATURE header (simulated)
      console.log('Step 3: Submitting signed payment...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success response
      const mockResponse = {
        message: 'Payment successful! Demo resource accessed.',
        service: 'x402 Payment Demo',
        timestamp: new Date().toISOString(),
        payment: {
          amount: `${price} ETH`,
          txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          receiver: '0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A',
        },
      };

      setPaymentResponse(mockResponse);
      setStatus('success');

    } catch (err) {
      console.error('x402 payment error:', err);
      setError(err.message || 'Payment failed');
      setStatus('error');
    }
  };

  return (
    <Web3Provider>
      <X402PaymentInner
        price={price}
        description={description}
        serviceName={serviceName}
        status={status}
        setStatus={setStatus}
        error={error}
        setError={setError}
        paymentResponse={paymentResponse}
        setPaymentResponse={setPaymentResponse}
        handlePayment={handleX402Payment}
      />
    </Web3Provider>
  );
}

// Inner component that receives Web3Provider context
function X402PaymentInner({
  price,
  description,
  serviceName,
  status,
  setStatus,
  error,
  setError,
  paymentResponse,
  setPaymentResponse,
  handlePayment,
}) {
  const { address, isConnected } = useAccount();

  return (
    <div className="x402-payment-card">
      <div className="x402-header">
        <h3>{serviceName}</h3>
        <p className="price">{price} ETH</p>
        <p className="description">{description}</p>
      </div>

      <div className="x402-status">
        {status === 'idle' && (
          <>
            {!isConnected ? (
              <div className="wallet-connect-hint">
                <p>Connect your wallet to test the x402 payment flow</p>
                <div className="wallet-badge">
                  <span className="badge-icon">🔗</span>
                  <span>Wallet required</span>
                </div>
              </div>
            ) : (
              <button
                className="x402-btn x402-btn-primary"
                onClick={() => handlePayment(address)}
                disabled={status !== 'idle'}
              >
                Pay with x402
              </button>
            )}
          </>
        )}

        {status === 'processing' && (
          <div className="x402-spinner">
            <div className="spinner"></div>
            <p>Processing x402 payment...</p>
            <div className="process-steps">
              <span className="step step-active">1. Request resource</span>
              <span className="step-arrow">→</span>
              <span className="step step-active">2. Create payment payload</span>
              <span className="step-arrow">→</span>
              <span className="step">3. Verify & settle</span>
            </div>
          </div>
        )}

        {status === 'success' && paymentResponse && (
          <div className="x402-success">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h4>Payment Complete!</h4>
              <p>x402 payment confirmed on-chain</p>
              <p className="receiver-info">
                Paid to: <code>{paymentResponse.payment?.receiver}</code>
              </p>
              {paymentResponse.payment?.txHash && (
                <a
                  href={`https://basescan.org/tx/${paymentResponse.payment.txHash}`}
                  target="_blank"
                  rel="noopener"
                  className="tx-link"
                >
                  View Transaction
                </a>
              )}
              <button
                className="x402-btn x402-btn-secondary"
                onClick={() => setStatus('idle')}
              >
                Test Again
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="x402-error">
            <div className="error-icon">✕</div>
            <div className="error-content">
              <h4>Payment Failed</h4>
              <p>{error || 'Unknown error occurred'}</p>
              <button
                className="x402-btn x402-btn-secondary"
                onClick={() => setStatus('idle')}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="x402-info">
        <div className="info-item">
          <span className="info-label">Protocol:</span>
          <span className="info-value">x402 v2</span>
        </div>
        <div className="info-item">
          <span className="info-label">Network:</span>
          <span className="info-value">Base (8453)</span>
        </div>
        <div className="info-item">
          <span className="info-label">Scheme:</span>
          <span className="info-value">exact (EIP-3009)</span>
        </div>
        <div className="info-item">
          <span className="info-label">Facilitator:</span>
          <span className="info-value">suchbot</span>
        </div>
      </div>

      <div className="x402-architecture">
        <h4>x402 Flow Architecture</h4>
        <div className="architecture-diagram">
          <div className="node client">
            <span className="node-title">Client</span>
            <span className="node-desc">Your wallet</span>
          </div>
          <div className="arrow">→ 402 →</div>
          <div className="node server">
            <span className="node-title">Resource Server</span>
            <span className="node-desc">API endpoint</span>
          </div>
          <div className="arrow">→ verify →</div>
          <div className="node facilitator">
            <span className="node-title">Facilitator</span>
            <span className="node-desc">suchbot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
