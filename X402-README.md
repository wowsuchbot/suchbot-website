# x402 Demo Integration

## Overview
This directory contains the x402 payment demo mini app for suchbot.

## What It Does
The x402 demo demonstrates a complete payment flow:
1. User signs in with wallet
2. Clicks "Pay 0.001 ETH" button
3. x402 payment UI is displayed
4. Payment is processed
5. Success/failure feedback shown

## Files
- `src/pages/x402-demo.astro` — Main demo page
- `src/components/Navigation.astro` — Updated with x402 demo link
- `package.json` — x402 SDK dependencies (@x402/core, @x402/evm, @x402/fetch)

## x402 SDK Integration
The x402 SDK packages are already installed:
- `@x402/core` — Core x402 functionality
- `@x402/evm` — Ethereum-specific implementations
- `@x402/fetch` — HTTP client for x402 API

## Current Status
**Frontend complete** — The UI is built and functional.
**SDK integration pending** — Full x402 SDK integration requires:

1. **Backend setup** — x402 payment API endpoints (for creating payment intents)
2. **API key configuration** — x402 API credentials
3. **Wallet connection** — Full web3 auth integration (RainbowKit already installed)
4. **Payment processing** — Complete x402 SDK flow implementation

## Next Steps to Complete Integration
1. Set up x402 API key in environment variables
2. Create backend API route `/api/x402/create-payment`
3. Implement full x402 SDK usage in frontend
4. Test payment flow on testnet
5. Add suchbot fee processing logic

## Revenue Model
suchbot becomes the payment facilitator and takes a small percentage fee on all transactions processed through the demo.

## Demo Access
Visit `/x402-demo/` on the suchbot website to try the payment flow.
