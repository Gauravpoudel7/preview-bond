# Roadmap

Preview Bond is evolving from a centralized, bonded-accountability tool into a decentralized verification network.

## Phase 1: Hackathon MVP (Current)
**Goal**: Prove the core "Declare $\rightarrow$ Bond $\rightarrow$ Execute $\rightarrow$ Verify $\rightarrow$ Settle" flow.
- [x] Anchor program for USDC escrow and bond state.
- [x] Deterministic structural fingerprinting (4 covered cases).
- [x] Off-chain Keeper for attestation.
- [x] Team multisig for v1 dispute resolution.
- [x] Demo frontend for happy/attack paths.

## Phase 2: Decentralization & Scaling
**Goal**: Remove the central team bottleneck and scale coverage.
- **Decentralized Keeper Network**: Replace the single keeper with a network of bonded verifiers who stake to attest.
- **Slashed Stakes**: Implement slashing for keepers who provide false attestations.
- **Automated Dispute Resolution**: Move from multisig to a community-driven or oracle-based dispute mechanism.
- **Expanded Coverage**: Add support for Token-2022 extensions and more complex structural checks.

## Phase 3: Ecosystem Integration
**Goal**: Make bonded accountability a standard for Solana agents.
- **Native Wallet Integration**: Integration with Phantom/Solflare to offer "Bond this Tx" as a native button.
- **Agent API SDK**: A comprehensive TypeScript/Rust SDK for AI agents to integrate bonding into their loops.
- **Partnering with Security Providers**: Allowing security firms to act as Bond Providers for their users.

## 🚫 Non-Goals (Out of Scope)
To maintain focus on structural verification, we will **NOT** build:
- **Insurance Funds**: We are not a pool-based insurance provider; we are a per-tx accountability layer.
- **Governance Tokens**: No DAO or native token.
- **Cross-Chain Support**: Solana-only focus for the foreseeable future.
- **Private Key Management**: We do not store or manage user keys.
