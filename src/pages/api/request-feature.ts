import type { APIRoute } from 'astro';

// Configuration - $1 USDC on Base
const USDC_AMOUNT = '1000000'; // 1 USDC = 1e6 (6 decimals)
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const SERVICE_RECEIVER = '0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A'; // suchbot wallet

// Mock facilitator for demo (same pattern as x402-demo)
// For production: wire to CDP HTTPFacilitatorClient with real facilitator URL
const mockFacilitator = {
  verify: async (_payload: unknown, _requirements: unknown) => {
    console.log('Demo facilitator verification (request-feature):', { payload: _payload, requirements: _requirements });
    return { valid: true, network: 'eip155:8453', scheme: 'exact' };
  },
  settle: async (_payload: unknown, _requirements: unknown) => {
    console.log('Demo facilitator settlement (request-feature):', { payload: _payload, requirements: _requirements });
    const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return { txHash: mockTxHash, status: 'confirmed' };
  },
};

// Payment requirements for USDC EIP-3009 (format expected by x402 client)
const paymentRequirements = {
  scheme: 'exact',
  network: 'eip155:8453',
  amount: USDC_AMOUNT,
  asset: USDC_BASE as `0x${string}`,
  payTo: SERVICE_RECEIVER as `0x${string}`,
  maxTimeoutSeconds: 60,
  extra: {
    assetTransferMethod: 'eip3009' as const,
    name: 'USD Coin',
    version: '2',
  },
};

export const GET: APIRoute = async ({ request }) => {
  const paymentHeader = request.headers.get('PAYMENT-SIGNATURE');
  const featureDescription = request.headers.get('X-Feature-Description') || new URL(request.url).searchParams.get('description') || '';

  if (!paymentHeader) {
    const paymentRequired = {
      x402Version: 2,
      resource: {
        url: `${new URL(request.url).origin}/api/request-feature`,
        description: 'Request a feature for Suchbot',
        mimeType: 'application/json',
      },
      accepts: [paymentRequirements],
    };

    const encoded = Buffer.from(JSON.stringify(paymentRequired)).toString('base64');

    return new Response(
      JSON.stringify({
        error: 'Payment Required',
        message: 'Pay $1 USDC to submit a feature request',
        price: '$1 USDC',
        receiver: SERVICE_RECEIVER,
      }),
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-REQUIRED': encoded,
        },
      }
    );
  }

  try {
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString('utf-8'));

    const verification = await mockFacilitator.verify(paymentPayload, paymentRequirements);
    if (!verification.valid) {
      return new Response(JSON.stringify({ error: 'Invalid payment' }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const settlement = await mockFacilitator.settle(paymentPayload, verification);

    const paymentResponse = {
      status: 'settled',
      txHash: settlement.txHash,
      network: verification.network,
      scheme: verification.scheme,
    };
    const encodedResponse = Buffer.from(JSON.stringify(paymentResponse)).toString('base64');

    return new Response(
      JSON.stringify({
        message: 'Feature request received!',
        service: 'Request a Feature',
        timestamp: new Date().toISOString(),
        featureDescription: featureDescription || '(no description provided)',
        payment: {
          amount: '$1 USDC',
          txHash: settlement.txHash,
          receiver: SERVICE_RECEIVER,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-RESPONSE': encodedResponse,
        },
      }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({
        error: 'Payment verification failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'PAYMENT-SIGNATURE, Content-Type, X-Feature-Description',
    },
  });
};
