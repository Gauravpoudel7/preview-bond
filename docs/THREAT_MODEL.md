# Threat Model

Preview Bond introduces economic stakes to transaction security. This document analyzes potential attack vectors and the mitigations implemented in v1.

## 1. Trust Assumptions (v1)
- **Keeper Trust**: We assume the Keeper correctly attests the result of the transaction.
- **Multisig Trust**: We assume the team multisig acts honestly during dispute resolution.
- **Simulator Trust**: We assume the simulator's fingerprinting logic is deterministic and correct.

## 2. Attack Vectors & Mitigations

### Vector: Malicious Keeper
**Attack**: A keeper attempts to falsely report a `MATCH` for a malicious transaction to protect the bond provider, or a `MISMATCH` to steal the bond.
- **Mitigation**: 
  - **Bonded Keepers**: Keepers must stake their own collateral (Planned for v2).
  - **Public Evidence**: Keeper attestations must include a `evidence_hash` that can be independently verified by any user.

### Vector: Claim Farming
**Attack**: A user colludes with a bond provider to create "safe" previews that they know will fail, essentially stealing the bond payout.
- **Mitigation**: 
  - **Payout Caps**: Per-transaction and per-day caps prevent large-scale coordinated theft.
  - **Provider Slashing**: Providers who have a high rate of `MISMATCH` results are flagged/blocked.

### Vector: Transaction Substitution
**Attack**: A user bonds `Tx A` but executes `Tx B` (which is malicious) while claiming it was `Tx A`.
- **Mitigation**: 
  - **Tx Digest Binding**: The bond is strictly bound to the `tx_digest` (hash of the unsigned transaction). Any change to the transaction invalidly breaks the bond.

### Vector: Correlated Claims
**Attack**: A systemic failure in a popular program (e.g., a major DEX) causes thousands of "safe" previews to fail simultaneously, draining the total bond pool.
- **Mitigation**: 
  - **Daily Global Caps**: Limits the total payout amount per 24-hour window.
  - **Provider Diversification**: Encouraging multiple bond providers to spread the risk.

### Vector: Race Condition (Release vs Claim)
**Attack**: A user tries to claim a bond at the exact moment the provider tries to release it.
- **Mitigation**: 
  - **State Machine Enforcement**: The on-chain program strictly enforces the sequence `Executed` $\rightarrow$ `Verified` $\rightarrow$ `Settled`. A bond cannot be released until the Keeper has submitted a verification.

## 3. Risk Summary Table

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Keeper Corruption | High | Low | Public Evidence / v2 Staking |
| Claim Farming | Medium | Medium | Payout Caps |
| Systemic Failure | High | Low | Daily Caps |
| Simulator Bug | Medium | Medium | Deterministic Logic / Open Source |
