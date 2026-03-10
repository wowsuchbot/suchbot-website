import React, { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import Web3Provider from './Web3Provider.jsx';

const DEMO_API = '/api/x402-demo'; // Local x402 endpoint

// Helper: Encode to base64
function toBase64(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

// Helper: Decode from base64
function fromBase64(str) {
  try {
    return JSON.parse(Buffer.from(str, 'base64').toString());
  } catch {
    return null;
  }
}

export default function X402Payment({ price, description, serviceName }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const handleX402Payment = async () => {
    try {
      setStatus('processing');
      setError(null);
      setPaymentResponse(null);

      if (!isConnected || !address) {
        throw new Error('Please connect your wallet first');
      }

      console.log('Step 1: Requesting protected resource...');

      // Step 1: Initial request - should return 402 Payment Required
      const initialResponse = await fetch(DEMO_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (initialResponse.status !== 402) {
        throw new Error(`Expected 402 Payment Required, got ${initialResponse.status}`);
      }

      // Get payment requirements from response headers
      const paymentRequiredHeader = initialResponse.headers.get('PAYMENT-REQUIRED');
      if (!paymentRequiredHeader) {
        throw new Error('PAYMENT-REQUIRED header not found');
      }

      const requirements = fromBase64(paymentRequiredHeader);
      console.log('Payment requirements:', requirements);

      // Step 2: Create and sign payment payload
      console.log('Step 2: Creating and signing payment payload...');

      // For demo purposes, we'll simulate the signature
      // In production, you would sign the structured data using signTypedDataAsync
      await new Promise(resolve => setTimeout(resolve, 800));

      const paymentPayload = {
        network: requirements.network,
        scheme: requirements.scheme,
        to: requirements.required.to,
        value: requirements.required.value,
        from: address,
        timestamp: Math.floor(Date.now() / 1000),
        // In production: real signature from wallet
        signature: '0x' + Array(130).fill(0).map(() =>
          Math.floor(Math.random() * 16).toString(16)
        ).join(''),
      };

      console.log('Step 3: Submitting signed payment...');

      // Step 3: Submit with PAYMENT-SIGNATURE header
      const finalResponse = await fetch(DEMO_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-SIGNATURE': toBase64(paymentPayload),
        },
      });

      if (!finalResponse.ok) {
        const errorData = await finalResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Payment failed with status ${finalResponse.status}`);
      }

      const data = await finalResponse.json();
      console.log('Payment successful:', data);

      setPaymentResponse(data);
      setStatus('success');

    } catch (err) {
      console.error('x402 payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setStatus('error');
    }
  };

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
                onClick={handleX402Payment}
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
