# Hackathon Context: Colosseum / Crypto World's Fair

This document provides the narrative and "pitch" logic for the Preview Bond project, designed for judges and reviewers.

## 🌟 The "Aha!" Moment
**The Gap**: Current security tools (Blowfish, Wallet Guard, etc.) are excellent at *warning* users. However, warnings are just noise if there is no accountability. If a tool says "This is safe" and it actually drains your wallet, the tool doesn't pay you back.

**The Solution**: Preview Bond turns a "warning" into a "guarantee." By putting real USDC behind the preview, we create **bonded accountability**. We aren't replacing security tools; we are adding a financial layer that makes them accountable.

## 🛠️ Implementation Status
- **Fully Functional**:
    - On-chain Bond lifecycle (Lock $\rightarrow$ Verify $\rightarrow$ Settle).
    - Structural fingerprinting for the 4 core coverage rules.
    - Keeper attestation flow.
    - Payout mechanism.
- **Mocked/Simplified**:
    - The v1 Keeper is a single instance (Decentralized network is in Roadmap).
    - Dispute resolution is a team multisig (Autonomous arbitration is in Roadmap).

## 📈 Evidence & Claims
- **The "Structural Trick"**: We can demonstrate a transaction that looks like a standard swap in a simulation but contains a hidden `transfer` or `assign` instruction—exactly the kind of "structural trick" that has led to multimillion-dollar losses in the past.
- **Market Opportunity**: Our target is not just the retail user, but the **AI Agent/Bot** economy. Agents need deterministic safety checks before signing on behalf of users.

## ❓ FAQ for Judges

### Q: Is this just insurance?
**A**: No. Insurance is usually a pool-based model covering broad risks. Preview Bond is **economic verification** for a specific, deterministic structural claim. We cover "structural tricks," not "market risks."

### Q: Why Solana only?
**A**: Solana's account-based model and the prevalence of complex CPIs (Cross-Program Invocations) make it the ideal environment for structural verification. We are optimizing for Solana's performance and account architecture.

### Q: Why target bots and agents first?
**A**: AI agents are the fastest-growing user base on Solana. They operate via API and need a programmatic way to ensure the transaction they are about to sign matches the intent they simulated.

### Q: What happens if the Bond Provider runs out of funds?
**A**: Payouts are capped per transaction and per day. If a provider is under-collateralized, the claim is paid up to the available bond and the global cap.
