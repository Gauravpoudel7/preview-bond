# Hackathon Demo Script

**⚠️ IMPORTANT: NOT INSURANCE.** This demo is a status-only proof of structural verification on localnet (Program ID: `5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi`). No real USDC or fund transfers are executed.

This guide provides a step-by-step flow to demonstrate Preview Bond's core value proposition to judges.

## 🛠️ Setup
1. **Launch App**: Run `pnpm run dev:web` and open `http://localhost:5173`.
2. **Environment**: Ensure `solana-test-validator` is running in the background.
3. **Open Explorer**: Keep a Solana Explorer tab open to show on-chain status changes.

---

## Scenario 1: The Happy Path (Normal Swap)
**Goal**: Show a standard, honest transaction resulting in a `Released` status.

1. **Input**: Select "Happy Path" from the demo UI.
2. **Flow**: Click the buttons to progress through `DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`.
3. **Outcome**: "Simulation Complete. Final Status: **Released**."

---

## Scenario 2: The Attack (Hidden Transfer)
**Goal**: Show a "safe" preview that hides a drain, resulting in a `ClaimPaid` status.

1. **Input**: Select "Attack Scenario" from the dropdown.
2. **Flow**: Progress through `DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`.
3. **Observation**: Point out that the preview looked honest, but the actual execution contained a structural trick.
4. **Outcome**: "Simulation Complete. Final Status: **ClaimPaid**."

---

## Scenario 3: The Boundary Case (Slippage)
**Goal**: Demonstrate that we do NOT pay for market volatility.

1. **Input**: Select "Slippage Case" from the dropdown.
2. **Flow**: Progress through `DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`.
3. **Observation**: Note that while a financial loss occurred, the structure of the transaction matched the promise.
4. **Outcome**: "Simulation Complete. Final Status: **Released**."

---

## ✅ Demo Checklist for Judges
- [ ] **Program ID**: Confirmed deployment to `5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi`.
- [ ] **Flow**: Successfully demonstrated the `DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE` state machine.
- [ ] **Logic**: Clearly distinguished between a "structural trick" (ClaimPaid) and "market slippage" (Released).
- [ ] **Caveat**: Explicitly stated the demo is status-only on localnet.
