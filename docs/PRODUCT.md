# Product Brief: Preview Bond

**⚠️ IMPORTANT: NOT INSURANCE.** Preview Bond is a structural verification tool providing proofs of transaction integrity. It is **not** a financial insurance product. The current hackathon proof is **status-only** on localnet (Program ID: `5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi`).

## Positioning
Preview Bond is an **economic verification** layer for Solana. It provides **bonded accountability** for transaction previews. We move beyond "warnings" by putting a verifiable commitment behind the claim that a transaction preview is honest and structurally sound.

## The Problem
Wallet previews are a guess, not a guarantee. Simulation engines can miss critical structural changes—such as `assign` or ownership transfers—that allow a malicious program to drain funds after the user signs. There is currently no mechanism on Solana to economically penalize a "safe" preview that turns out to be malicious.

## Core Solution
Preview Bond introduces a bonded commitment. If a user executes a transaction based on a "safe" preview, and that transaction contains a covered structural trick, the system provides a verified proof of loss.

### Core Flow
1. **DECLARE**: Simulate the transaction and record a structural fingerprint (signers, programs, token transfers, account changes).
2. **BOND**: A structural commitment is recorded in an on-chain Solana program.
3. **VERIFY**: An off-chain Keeper compares the actual on-chain outcome against the initial fingerprint.
4. **SETTLE**: 
   - **Match**: Bond status is set to `Released`.
   - **Covered Mismatch**: Bond status is set to `ClaimPaid`.

## Coverage Scope

### ✅ Covered (Structural Tricks)
We only cover deterministic structural failures:
- **Hidden extra token transfer**: Tokens leaving the wallet that were not in the preview.
- **Surprise program (CPI)**: Execution of a program not listed in the simulated preview.
- **Authority/Approval change**: Undisclosed changes to account ownership or token approvals.
- **Wrong program executed**: The program ID executed differs from the one checked.

### ❌ NOT Covered
- **Price moves / Slippage**: Market volatility is the user's risk.
- **Private key theft**: We protect the transaction, not the wallet's storage.
- **Visible Drains**: If the simulation already showed a drain and the user signed anyway, it is not covered.

## Trust Model (v1)
Preview Bond v1 is **bonded + keeper-attested**.
- The system is not yet fully trustless; the team multisig settles disputes in v1.
- Payouts are subject to per-transaction and per-day caps to mitigate correlated risk.

## Monetization
**Proposed Fee: ~30 bps (0.30%) of coverage amount.**
Our narrower scope (structural honesty vs. general insurance) allows for a lower fee while remaining sustainable.

## Target Customers
- **Primary**: Solana trading bots and AI agent wallets via API.
- **Secondary**: Wallet integrations and security platforms.
