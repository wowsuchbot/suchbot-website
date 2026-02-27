import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Web3Provider from './Web3Provider.jsx';
import { ConnectWallet } from './ConnectWallet.jsx';

const REQUEST_FEATURE_API = '/api/request-feature';

export default function RequestFeature() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [featureDescription, setFeatureDescription] = useState('');
  const [paymentResponse, setPaymentResponse] = useState(null);

  const handleRequestFeature = async (address) => {
    try {
      setStatus('processing');
      setError(null);
      setPaymentResponse(null);

      // Step 1: Request without payment (expect 402)
      const url = `${REQUEST_FEATURE_API}?description=${encodeURIComponent(featureDescription)}`;
      const init = {
        headers: { 'X-Feature-Description': featureDescription },
      };

      const firstResponse = await fetch(url, init);

      if (firstResponse.status !== 402) {
        throw new Error(firstResponse.status === 200 ? 'Already paid' : `Unexpected status: ${firstResponse.status}`);
      }

      // Demo: simulate x402 payment flow (EIP-3009 USDC sign + settle)
      // In production, use wrapFetchWithPaymentFromConfig with ExactEvmScheme:
      //
      // import { wrapFetchWithPaymentFromConfig } from '@x402/fetch';
      // import { ExactEvmScheme } from '@x402/evm/exact/client';
      // const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
      //   schemes: [{
      //     network: 'eip155:8453',
      //     client: new ExactEvmScheme(walletClient),
      //   }],
      // });
      // const response = await fetchWithPayment(url, { headers: { 'X-Feature-Description': featureDescription } });
      //

      await new Promise((r) => setTimeout(r, 600));
      await new Promise((r) => setTimeout(r, 600));
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Simulated retry with PAYMENT-SIGNATURE (demo uses mock facilitator)
      const mockPayload = { demo: true, from: address };
      const mockSignature = btoa(JSON.stringify(mockPayload));
      const secondResponse = await fetch(url, {
        headers: {
          'PAYMENT-SIGNATURE': mockSignature,
          'X-Feature-Description': featureDescription,
        },
      });

      if (!secondResponse.ok) {
        const errData = await secondResponse.json().catch(() => ({}));
        throw new Error(errData.message || `Payment failed: ${secondResponse.status}`);
      }

      const data = await secondResponse.json();
      setPaymentResponse(data);
      setStatus('success');
    } catch (err) {
      console.error('Request feature error:', err);
      setError(err.message || 'Request failed');
      setStatus('error');
    }
  };

  return (
    <Web3Provider>
      <RequestFeatureInner
        status={status}
        setStatus={setStatus}
        error={error}
        setError={setError}
        featureDescription={featureDescription}
        setFeatureDescription={setFeatureDescription}
        paymentResponse={paymentResponse}
        setPaymentResponse={setPaymentResponse}
        handleRequestFeature={handleRequestFeature}
      />
    </Web3Provider>
  );
}

function RequestFeatureInner({
  status,
  setStatus,
  error,
  setError,
  featureDescription,
  setFeatureDescription,
  paymentResponse,
  setPaymentResponse,
  handleRequestFeature,
}) {
  const { address, isConnected } = useAccount();

  return (
    <div className="request-feature-card">
      <div className="request-feature-header">
        <h3>Request a Feature</h3>
        <p className="price">$1 USDC</p>
        <p className="description">
          Pay $1 USDC to submit a feature request. Suchbot will review and triage.
        </p>
      </div>

      {status === 'idle' && (
        <>
          {!isConnected ? (
            <div className="wallet-connect-hint">
              <p>Connect your wallet to request a feature</p>
              <ConnectWallet />
            </div>
          ) : (
            <>
              <textarea
                className="feature-input"
                placeholder="Describe the feature you'd like..."
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <button
                className="request-feature-btn"
                onClick={() => handleRequestFeature(address)}
                disabled={!featureDescription.trim()}
              >
                Request Feature — $1 USDC
              </button>
            </>
          )}
        </>
      )}

      {status === 'processing' && (
        <div className="request-feature-spinner">
          <div className="spinner" />
          <p>Processing payment...</p>
        </div>
      )}

      {status === 'success' && paymentResponse && (
        <div className="request-feature-success">
          <div className="success-icon">✓</div>
          <h4>Feature Request Submitted!</h4>
          <p>{paymentResponse.message}</p>
          {paymentResponse.featureDescription && (
            <p className="feature-summary">"{paymentResponse.featureDescription}"</p>
          )}
          {paymentResponse.payment?.txHash && (
            <a
              href={`https://basescan.org/tx/${paymentResponse.payment.txHash}`}
              target="_blank"
              rel="noopener"
              className="tx-link"
            >
              View transaction
            </a>
          )}
          <button
            className="request-feature-btn secondary"
            onClick={() => {
              setStatus('idle');
              setPaymentResponse(null);
              setFeatureDescription('');
            }}
          >
            Submit another
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="request-feature-error">
          <div className="error-icon">✕</div>
          <h4>Request failed</h4>
          <p>{error}</p>
          <button
            className="request-feature-btn secondary"
            onClick={() => setStatus('idle')}
          >
            Try again
          </button>
        </div>
      )}

      <div className="request-feature-info">
        <span>Base · USDC · x402</span>
      </div>
    </div>
  );
}
