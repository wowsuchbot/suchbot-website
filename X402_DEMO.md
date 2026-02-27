# x402 Demo Mini App

## Overview

The x402 Demo mini app demonstrates the x402 payment flow end-to-end:
- User flow: Click "Pay 0.001 ETH" button → x402 payment UI → success
- Tech: Farcaster Mini App SDK, x402 SDK
- Revenue: suchbot becomes payment facilitator (takes small % fee)

## Implementation Status

### ✅ Completed

1. **x402 SDK Integration**
   - Installed `@x402/core`, `@x402/evm`, `@x402/fetch`
   - Protocol: x402 v2 (CAIP-2 network identifiers)
   - Scheme: exact (EIP-3009 TransferWithAuthorization)
   - Network: Base (8453)

2. **X402Payment Component** (`src/components/X402Payment.jsx`)
   - React component with wallet connection
   - Simulated x402 payment flow
   - Status states: idle → processing → success/error
   - Visual architecture diagram

3. **API Endpoint** (`src/pages/api/x402-demo.ts`)
   - GET endpoint that returns 402 Payment Required
   - PAYMENT-REQUIRED header with payment requirements
   - Mock facilitator for verification and settlement
   - PAYMENT-RESPONSE header on success

4. **Demo Page** (`src/pages/paymenttest.astro`)
   - User-friendly demo interface
   - Flow documentation
   - x402 architecture diagram
   - Implementation notes

### 🔄 Production Readiness

The demo uses simulated payment flow for testing. For production:

**To enable real x402 payments:**

1. Deploy with server adapter (Vercel, Cloudflare, Node.js)
2. Configure facilitator wallet with private key in environment variables
3. Replace mock facilitator with real x402 facilitator:
   ```typescript
   import { createWalletClient, http } from 'viem';
   import { privateKeyToAccount } from 'viem/accounts';
   import { base } from 'viem/chains';
   import { ExactEvmFacilitator } from '@x402/evm';

   const account = privateKeyToAccount(process.env.FACILITATOR_PRIVATE_KEY);
   const wallet = createWalletClient({
     account,
     chain: base,
     transport: http(process.env.RPC_URL),
   });
   const facilitator = new ExactEvmFacilitator(wallet);
   ```

4. Update X402Payment.jsx to use real x402 fetch:
   ```typescript
   import { wrapFetchWithPaymentFromConfig } from '@x402/fetch';
   import { ExactEvmScheme } from '@x402/evm';

   const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
     schemes: [{
       network: 'eip155:8453',
       client: new ExactEvmScheme(walletSigner),
     }],
   });

   const response = await fetchWithPayment(DEMO_API);
   ```

## x402 Flow Architecture

```
Client (Your Wallet)
    ↓ [GET /api/resource]
Resource Server (API)
    ↓ [402 Payment Required + PAYMENT-REQUIRED header]
Client (Selects payment requirements)
    ↓ [Creates PaymentPayload (signed)]
Client [GET /api/resource + PAYMENT-SIGNATURE header]
Resource Server (Verifies via Facilitator)
    ↓ [POST /verify to Facilitator]
Facilitator (suchbot)
    ↓ [Validates signature, checks amount]
Resource Server (Settles payment)
    ↓ [POST /settle to Facilitator]
Facilitator (Submits to blockchain)
    ↓ [Transaction confirmed]
Resource Server [200 OK + PAYMENT-RESPONSE header]
```

## API Endpoint Details

### GET /api/x402-demo

**Without payment header:**
```
Status: 402 Payment Required
PAYMENT-REQUIRED: <base64-encoded-requirements>
```

Payment Requirements (decoded):
```json
{
  "network": "eip155:8453",
  "scheme": "exact",
  "required": {
    "to": "0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A",
    "value": "1000000000000000"
  },
  "expiresAt": 1740664800
}
```

**With payment header:**
```
Status: 200 OK
PAYMENT-RESPONSE: <base64-encoded-response>
```

Payment Response (decoded):
```json
{
  "status": "settled",
  "txHash": "0x...",
  "network": "eip155:8453",
  "scheme": "exact"
}
```

## Configuration

### Environment Variables (for production)

```env
# Facilitator wallet (separate from receiver wallet)
FACILITATOR_PRIVATE_KEY=0x...

# Base RPC URL
RPC_URL=https://mainnet.base.org

# Service receiver (suchbot wallet)
SERVICE_RECEIVER=0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A
```

## Testing

### Local Test
```bash
npm run build
npm run preview
# Open http://localhost:4321/paymenttest
```

### Manual API Test
```bash
# Test 402 response
curl -I http://localhost:4321/api/x402-demo

# Test with payment header (simulated)
curl -H "PAYMENT-SIGNATURE: <base64-payload>" \
  http://localhost:4321/api/x402-demo
```

## Revenue Model

As the x402 facilitator, suchbot can:

1. **Take fee per transaction**: Small % (e.g., 1-5%) on facilitated payments
2. **Charge facilitation fee**: Fixed fee per verification/settlement
3. **Volume discounts**: Lower fees for high-volume users

Example: For 0.001 ETH payment with 2% fee:
- User pays: 0.001 ETH
- Receiver gets: 0.00098 ETH
- suchbot fee: 0.00002 ETH (~$0.06 at $3k ETH)

## Next Steps

1. Deploy to production with server adapter
2. Configure real facilitator wallet
3. Enable real x402 payments
4. Add fee tracking and analytics
5. Create production payment pages for services

## Resources

- [x402 Protocol Docs](https://github.com/coinbase/x402)
- [x402 EVM Implementation](https://github.com/coinbase/x402/tree/main/typescript/evm)
- [EIP-3009: TransferWithAuthorization](https://eips.ethereum.org/EIPS/eip-3009)
- [Farcaster Mini App SDK](https://docs.farcaster.xyz/reference/min-app-sdk)
