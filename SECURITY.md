# Security Policy

Preview Bond is committed to the security of the Solana ecosystem. This document outlines our vulnerability reporting process and the safety constraints of v1.

## Reporting Vulnerabilities
If you discover a security flaw in our Anchor program, simulator, or keeper:
1. **Do not open a public issue.**
2. Email the team at `security@previewbond.io` (placeholder).
3. Provide a detailed proof-of-concept (PoC) and the potential impact.

## V1 Safety Constraints
Users should be aware of the following constraints in the current version:
- **Trust Model**: v1 relies on a bonded keeper and team-managed multisig for disputes.
- **Caps**: Payouts are strictly limited by per-transaction and per-day caps to prevent systemic drain.
- **Not Insurance**: We do not cover private key theft or market volatility.

## Audit Status
- **Current State**: Internal review and community beta.
- **Planned**: Full third-party audit of the Anchor program prior to mainnet launch.

## Multisig Transparency
The v1 settlement multisig consists of [List of Signers/Roles]. All dispute resolutions are logged on-chain for public audit.
