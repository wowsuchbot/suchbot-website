import type { APIRoute } from 'astro';

// Configuration
const SERVICE_PRICE = '1000000000000000'; // 0.001 ETH in wei
const SERVICE_RECEIVER = '0xe1eA12cFB888E8307dA30AD48AC5e89C6fEB787A'; // suchbot wallet

// Note: In production, use environment variables for private keys
// This is a demo - the facilitator wallet is separate from the receiver wallet
// Facilitator verifies payments but doesn't receive funds directly

// Mock facilitator for demo (in production, this would verify on-chain)
const mockFacilitator = {
  verify: async (paymentPayload: any, paymentRequirements: any) => {
    // In production, this would:
    // 1. Decode the EIP-3009 TransferWithAuthorization
    // 2. Verify the signature
    // 3. Check that transfer amount matches requirement
    // 4. Check that recipient matches SERVICE_RECEIVER
    // 5. Return verification result

    // For demo: accept any valid-looking payload
    console.log('Demo facilitator verification:', {
      payload: paymentPayload,
      requirements: paymentRequirements,
    });

    return {
      valid: true,
      network: 'eip155:8453',
      scheme: 'exact',
    };
  },

  settle: async (paymentPayload: any, paymentRequirements: any) => {
    // In production, this would:
    // 1. Submit the signed authorization to the blockchain
    // 2. Wait for confirmation
    // 3. Return transaction hash

    // For demo: return simulated tx hash
    const mockTxHash = '0x' + Array(64).fill(0).map(() =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    return {
      txHash: mockTxHash,
      status: 'confirmed',
    };
  },
};

export const GET: APIRoute = async ({ request }) => {
  const paymentHeader = request.headers.get('PAYMENT-SIGNATURE');

  // If no payment header, return 402 with payment requirements
  if (!paymentHeader) {
    const paymentRequirements = {
      network: 'eip155:8453',
      scheme: 'exact',
      required: {
        to: SERVICE_RECEIVER as `0x${string}`,
        value: SERVICE_PRICE as `${bigint}`,
      },
      expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };

    // Base64 encode for header
    const encoded = Buffer.from(JSON.stringify(paymentRequirements)).toString('base64');

    return new Response(
      JSON.stringify({
        error: 'Payment Required',
        message: 'This endpoint requires x402 payment',
        price: '0.001 ETH',
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

  // Payment header present - verify payment
  try {
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());

    // Verify payment using facilitator
    const verification = await mockFacilitator.verify(
      paymentPayload,
      {
        network: 'eip155:8453',
        scheme: 'exact',
        required: {
          to: SERVICE_RECEIVER as `0x${string}`,
          value: SERVICE_PRICE as `${bigint}`,
        },
      }
    );

    if (!verification.valid) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment' }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Settle payment (in production, submit to blockchain)
    const settlement = await mockFacilitator.settle(paymentPayload, verification);

    // Return success response with payment confirmation
    const paymentResponse = {
      status: 'settled',
      txHash: settlement.txHash,
      network: verification.network,
      scheme: verification.scheme,
    };

    const encodedResponse = Buffer.from(JSON.stringify(paymentResponse)).toString('base64');

    return new Response(
      JSON.stringify({
        message: 'Payment successful! Demo resource accessed.',
        service: 'x402 Payment Demo',
        timestamp: new Date().toISOString(),
        payment: {
          amount: '0.001 ETH',
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
      {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Add OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'PAYMENT-SIGNATURE, Content-Type',
    },
  });
};
