# Hackathon Demo Script

**⚠️ IMPORTANT: NOT INSURANCE.** This demo is a status-only proof of structural verification on localnet. No real USDC or fund transfers are executed.

This guide provides a step-by-step flow to demonstrate Preview Bond's core value proposition to judges.

## 🛠️ Setup
1. **Launch Environment**: Run the UI (usually `pnpm run dev:web` or similar).
2. **Fund Wallets**: Ensure the Demo User has SOL on `localnet`.
3. **Open Explorer**: Keep a Solana Explorer tab open to show on-chain status changes.

---

## Scenario 1: The Happy Path (Normal Swap)
**Goal**: Show a standard, honest transaction resulting in a `Released` status.

1. **Input**: Select "Happy Path" from the demo UI.
2. **Declare**: Click `Declare`. Show the generated "Expected Fingerprint" (Programs, Transfers).
3. **Bond**: Click `Bond`. 
   - **Explorer Check**: Point to the on-chain `BondAccount` status transitioning to `Locked`.
4. **Execute**: The transaction lands on-chain.
5. **Settle**: The Keeper detects the match $\rightarrow$ Bond status is set to `Released`.
6. **Outcome**: "Transaction Verified: Honest."

---

## Scenario 2: The Attack (Hidden Transfer)
**Goal**: Show a "safe" preview that hides a drain, resulting in a `ClaimPaid` status.

1. **Input**: Select "Attack Scenario" from the dropdown.
2. **Declare**: Click `Declare`. Show that the preview looks **identical** to the happy path (no hidden transfers shown).
3. **Bond**: Click `Bond`.
   - **Explorer Check**: Show the bond status `Locked` for this specific `tx_digest`.
4. **Execute**: The transaction lands on-chain.
5. **Verify**: Show the Keeper's output: `MISMATCH DETECTED: Unexpected transfer of 10 USDC to 0xBadActor`.
6. **Settle**: Click `Settle`.
   - **Explorer Check**: Show the status transition to `ClaimPaid`.
7. **Outcome**: "Structural Trick Detected: Claim Verified."

---

## Scenario 3: The Boundary Case (Slippage)
**Goal**: Demonstrate that we do NOT pay for market volatility.

1. **Input**: Select "Slippage Case" from the dropdown.
2. **Declare**: Click `Declare` $\rightarrow$ Bond $\rightarrow$ Execute.
3. **Result**: The transaction executes, but the user receives 2% less tokens than expected due to slippage.
4. **Verify**: The Keeper finds a `MATCH` (no structural trick, just different amounts).
5. **Settle**: Bond status is set to `Released`.
6. **Outcome**: "Transaction Verified: Honest (Slippage is not covered)."

---

## ✅ Demo Checklist for Judges
- [ ] **On-chain Status**: Did we show the status transition (`Locked` $\rightarrow$ `Released`/`ClaimPaid`) on the explorer?
- [ ] **Fingerprint**: Did we show the difference between Expected vs Actual?
- [ ] **Payout Proof**: Did we show the bond status transitioning to `ClaimPaid` on a covered trick?
- [ ] **Exclusion**: Did we clearly explain why slippage doesn't pay?
