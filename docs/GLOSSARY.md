# Glossary

A guide to the terminology used in the Preview Bond ecosystem.

| Term | Definition |
|---|---|
| **Bond** | A specific amount of USDC locked in a Solana program to guarantee the honesty of a transaction preview. |
| **Bonded Accountability** | The practice of putting economic stakes behind a technical claim (e.g., "this preview is honest"). |
| **Economic Verification** | Using financial incentives and penalties to ensure the correctness of a process, rather than relying solely on trust or warnings. |
| **Structural Trick** | A technical manipulation of a transaction (like a hidden CPI or authority change) that allows it to perform actions not disclosed in its simulation. |
| **Preview / Fingerprint** | A deterministic summary of a transaction's expected outcome (programs called, token movements, account changes). |
| **Keeper** | An off-chain agent that monitors the network, verifies the outcome of a bonded transaction, and submits an attestation. |
| **CPI (Cross-Program Invocation)** | When one Solana program calls another. "Unexpected CPIs" are a core covered risk. |
| **Settlement** | The final on-chain movement of funds (returning the bond or paying the user) based on the verification result. |
| **Slippage** | The difference between the expected price of a trade and the price at which the trade is executed. (Explicitly NOT covered). |
| **Settle-by-Multisig** | The v1 process where a team-managed multisig resolves disputes between users and providers. |
