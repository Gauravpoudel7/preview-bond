# Product Brief: Preview Bond

**⚠️ IMPORTANT: NOT INSURANCE.** Preview Bond is a structural verification tool providing proofs of transaction integrity. It is NOT a financial insurance product and does not provide guaranteed monetary reimbursement for all types of losses.

## Positioning
Preview Bond is an **economic verification** layer for Solana. It provides **bonded accountability** for transaction previews. 

We move beyond "warnings" (which are commoditized) by putting a verifiable commitment behind the claim that a transaction preview is honest and structurally sound.

## The Problem
Wallet previews are a guess, not a guarantee. Simulation engines can miss critical structural changes—such as `assign` or ownership transfers—that allow a malicious program to drain funds after the user signs. 

While tools like Blowfish or Wallet Guard provide critical warnings, there is currently no mechanism on Solana to economically penalize a "safe" preview that turns out to be malicious.

## Core Solution
Preview Bond fills this gap by introducing a bonded commitment. If a user executes a transaction based on a "safe" preview provided by a bonded agent/service, and that transaction contains a covered structural trick, the system provides a verified proof of loss.

### Core Flow
1. **DECLARE**: A bot/agent sends an unsigned transaction. The system simulates it and records a structural fingerprint (signers, programs, token transfers, account changes).
2. **BOND**: A structural commitment is recorded in an on-chain Solana program. The bond is verifiable on-chain, not in a database.
3. **EXECUTE**: The transaction is signed and executed on the Solana network.
4. **VERIFY**: An off-chain Keeper compares the actual on-chain outcome (balances, inner instructions, program hashes) against the initial fingerprint.
5. **SETTLE**:
   - **Match**: The bond status is set to Released; a small fee is recorded.
   - **Covered Mismatch + Realized Loss**: The status is set to ClaimPaid.
   - **Harmless Mismatch ($0 loss)**: No payout.

## Coverage Scope

### Covered (The 4 Structural Tricks)
We only cover deterministic structural failures:
1. **Hidden extra token transfer**: Tokens leaving the wallet that were not in the preview.
2. **Surprise program (CPI)**: Execution of a program not listed in the simulated preview.
3. **Authority/Approval change**: Undisclosed changes to account ownership or token approvals.
4. **Wrong program executed**: The program ID executed differs from the one checked.

### NOT Covered
- **Price moves / Slippage**: Market volatility is the user's risk.
- **Private key theft**: We protect the transaction, not the wallet's storage.
- **Visible Drains**: If the simulation already showed a drain and the user signed anyway, it is not covered.

## Trust Model (v1)
Preview Bond v1 is **bonded + keeper-attested**.
- It is not yet fully trustless.
- The team multisig settles disputes in v1.
- Payouts are subject to per-transaction and per-day caps to mitigate correlated risk.

## Monetization
**Proposed Fee: 30 bps (0.30%) of coverage amount.**

*Reasoning: Our scope is narrower than general transaction protection (e.g., Pocket Universe on EVM), allowing us to offer a lower fee while remaining sustainable.*

## Target Customers
- **Primary**: Solana trading bots and AI agent wallets via API.
- **Secondary**: Wallet integrations and security platforms.

## Evidence for Value
- **Authority Class**: Similar to the "assign" miss found by Coinspect in Blowfish simulations.
- **Phishing**: Maps to the authority-transfer attacks identified by SolPhishHunter.
