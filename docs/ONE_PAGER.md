# Preview Bond: One-Pager

**Bonded Accountability for Solana Transaction Previews**

### The Problem
Wallet transaction previews are simulation-based guesses. They often miss "structural tricks"—like undisclosed authority changes or hidden CPI calls—that allow a malicious program to drain a wallet *after* the user signs. Currently, there is no economic penalty for a service that provides a "safe" preview that turns out to be malicious.

### The Solution
Preview Bond introduces an economic layer to transaction integrity. By recording a **structural fingerprint** on-chain and requiring a **bond commitment**, we ensure that the agent providing the preview is held accountable for its honesty.

### Core Flow
**`DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`**
1. **Declare**: Record the expected structural fingerprint (signers, programs, transfers).
2. **Bond**: Provider locks a bond as a commitment to the preview's honesty.
3. **Verify**: A Keeper compares the actual on-chain execution against the fingerprint.
4. **Settle**: 
   - **Match** $\rightarrow$ Bond `Released`.
   - **Structural Trick** $\rightarrow$ Bond `ClaimPaid`.

### Coverage Scope
| ✅ Covered (Structural Tricks) | ❌ Not Covered (User Risk) |
| :--- | :--- |
| Hidden extra SPL token transfers | Market Price Slippage / Volatility |
| Surprise CPI (Unexpected programs) | Wallet Private Key Theft |
| Undisclosed Authority/Approval changes | Drains already visible in the preview |
| Execution of the wrong program | General "Bad Trade" decisions |

### Trust & Economics (v1)
- **Model**: Bonded + Keeper-Attested.
- **Governance**: Team multisig handles disputes; payouts are subject to strict per-tx and per-day caps.
- **Fee**: ~30 bps (0.30%) of coverage amount.
- **Platform**: Solana-only.

### Current Proof (Hackathon)
The current implementation is a **status-only proof on localnet**. It demonstrates the full on-chain state machine and verification logic without executing real USDC transfers.
- **Program ID**: `5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi`

**Bottom Line: We don’t cover bad prices; we cover broken promises.**
