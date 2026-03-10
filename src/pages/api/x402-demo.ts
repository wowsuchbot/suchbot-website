// x402 Demo API Endpoint
// Implements x402 v2 payment flow for demo purposes

import type { APIRoute } from 'astro';

// Disable prerendering for this API endpoint (needs request headers)
export const prerender = false;

// Configuration
const SERVICE_RECEIVER = '0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A'; // suchbot wallet
const DEMO_PRICE_WEI = BigInt('1000000000000000'); // 0.001 ETH
const NETWORK = 'eip155:8453'; // Base mainnet
const SCHEME = 'exact'; // EIP-3009 TransferWithAuthorization

interface PaymentRequirements {
  network: string;
  scheme: string;
  required: {
    to: string;
    value: string;
  };
  expiresAt: number;
}

interface PaymentResponse {
  status: string;
  txHash?: string;
  network: string;
  scheme: string;
}

// Helper: Encode to base64
function toBase64(obj: any): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

// Helper: Decode from base64
function fromBase64(str: string): any {
  try {
    return JSON.parse(Buffer.from(str, 'base64').toString());
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const paymentSignature = request.headers.get('PAYMENT-SIGNATURE');

  // No payment header: Return 402 Payment Required
  if (!paymentSignature) {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const paymentRequirements: PaymentRequirements = {
      network: NETWORK,
      scheme: SCHEME,
      required: {
        to: SERVICE_RECEIVER,
        value: DEMO_PRICE_WEI.toString(),
      },
      expiresAt,
    };

    return new Response(JSON.stringify({
      error: 'Payment Required',
      message: 'This resource requires payment via x402 protocol',
    }), {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'PAYMENT-REQUIRED': toBase64(paymentRequirements),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'PAYMENT-SIGNATURE, PAYMENT-RESPONSE',
        'Access-Control-Expose-Headers': 'PAYMENT-REQUIRED, PAYMENT-RESPONSE',
      },
    });
  }

  // Payment header present: Verify and process payment
  try {
    const paymentPayload = fromBase64(paymentSignature);

    if (!paymentPayload) {
      return new Response(JSON.stringify({
        error: 'Invalid Payment Signature',
        message: 'Could not decode PAYMENT-SIGNATURE header',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Demo mode: Simulate payment verification
    // In production, this would:
    // 1. Verify the signature using the facilitator
    // 2. Check that the amount matches requirements
    // 3. Settle the payment via the facilitator
    // 4. Return the transaction hash

    console.log('Payment payload received:', paymentPayload);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock transaction hash for demo
    const mockTxHash = '0x' + Array(64).fill(0).map(() =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const paymentResponse: PaymentResponse = {
      status: 'settled',
      txHash: mockTxHash,
      network: NETWORK,
      scheme: SCHEME,
    };

    return new Response(JSON.stringify({
      message: 'Payment successful! Demo resource accessed.',
      service: 'x402 Payment Demo',
      timestamp: new Date().toISOString(),
      payment: {
        amount: '0.001 ETH',
        txHash: mockTxHash,
        receiver: SERVICE_RECEIVER,
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'PAYMENT-RESPONSE': toBase64(paymentResponse),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'PAYMENT-SIGNATURE, PAYMENT-RESPONSE',
        'Access-Control-Expose-Headers': 'PAYMENT-REQUIRED, PAYMENT-RESPONSE',
      },
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({
      error: 'Payment Verification Failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'PAYMENT-SIGNATURE, PAYMENT-RESPONSE',
      'Access-Control-Expose-Headers': 'PAYMENT-REQUIRED, PAYMENT-RESPONSE',
    },
  });
};
