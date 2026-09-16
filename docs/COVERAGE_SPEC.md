# Coverage Specification

This document defines the technical requirements for a "Covered Event" and the conditions under which a bond payout is triggered.

## 1. The Coverage Receipt
Every bonded transaction generates a **Coverage Receipt**. For a claim to be valid, the actual transaction must be compared against this receipt.

| Field | Description |
|---|---|
| `tx_digest` | Hash of the unsigned transaction. |
| `preview_digest` | Hash of the simulated structural fingerprint. |
| `accounts` | List of all accounts involved in the transaction. |
| `mints` | List of all token mints transferred or modified. |
| `payout_cap` | The maximum USDC payout for this specific tx. |
| `expiry` | Timestamp after which the bond is automatically released. |

## 2. Payout Conditions
A payout is triggered **ONLY** if both of the following conditions are met:
1. **Structural Mismatch**: The actual on-chain execution violates one of the 4 coverage rules (see Section 3).
2. **Realized Loss**: The user suffered a measurable loss of funds (USDC/SOL/Tokens) directly resulting from that mismatch.

**Note:** A structural mismatch with $0 loss (e.g., a harmless unexpected CPI that didn't move funds) results in **NO payout**.

## 3. Coverage Rules (The 4 Structural Tricks)

### Rule 1: Hidden Token Transfer
- **Definition**: Any `transfer` or `transferChecked` instruction that moves tokens out of a user-controlled account and was not present in the simulation fingerprint.
- **Evidence**: `getTransaction` inner instructions showing a transfer to an address not in the preview.

### Rule 2: Surprise Program (CPI)
- **Definition**: The execution of any program (Cross-Program Invocation) that was not listed in the simulated preview's program set.
- **Evidence**: `getTransaction` logs or inner instructions referencing a Program ID not in the `preview_digest`.

### Rule 3: Authority/Approval Change
- **Definition**: Any instruction that changes the `owner`, `authority`, or `approval` status of a user's account or token account.
- **Evidence**: Account state changes showing a new authority address compared to the pre-tx state.

### Rule 4: Wrong Program Execution
- **Definition**: The main transaction was routed to a Program ID different from the one verified during the `DECLARE` phase.
- **Evidence**: The transaction's primary instruction program ID differs from the declared program ID.

## 4. Exclusions
The following are explicitly **NOT** covered:
- **Slippage/Price**: Payouts are not made for losses due to price movement or bad slippage settings.
- **Pre-existing Risk**: If the simulation showed a transfer of $100 and the user signed it, the loss of $100 is not covered.
- **Key Compromise**: Losses resulting from private key theft.

## 5. Bond Statuses

| Status | Meaning |
|---|---|
| `QUOTED` | Preview generated, bond amount proposed. |
| `LOCKED` | USDC successfully locked in the program. |
| `RELEASED` | Tx executed and matched; funds returned to provider. |
| `CLAIM_PAID` | Mismatch detected + loss verified; funds paid to user. |
| `NOT_COVERED` | Mismatch detected but deemed an exclusion (e.g. slippage). |
| `EVIDENCE_PENDING` | Discrepancy found; waiting for loss verification. |
| `DISPUTED` | User or provider challenged the Keeper's attestation. |
| `DENIED` | Claim rejected by multisig after dispute. |

## 6. Caps & Disputes
- **Caps**: Payouts are limited by the `payout_cap` in the receipt and the global daily cap.
- **Disputes**: v1 disputes are handled by a team multisig. Evidence must be submitted via the `CLAIM` instruction.
