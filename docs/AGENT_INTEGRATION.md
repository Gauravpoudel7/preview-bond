# Agent Integration Guide

Preview Bond is designed for "Agent-First" security. This guide explains how AI agents and trading bots should integrate bonding into their execution loop.

## 1. The Agent Safety Loop

An agent should never sign a transaction based on a simulation alone. Instead, it should follow the **Bonded Loop**:

`Intent` $\rightarrow$ `Simulate` $\rightarrow$ `Declare` $\rightarrow$ `Verify Bond` $\rightarrow$ `Sign/Execute`

### Step-by-Step Integration
1. **Simulate**: The agent generates a transaction and calls `/v1/declare` to get the structural fingerprint.
2. **Bond**: The agent (or its provider) calls the on-chain `bond_tx` instruction to lock USDC.
3. **Verify Bond**: The agent polls `/v1/status/{tx_digest}` to ensure the bond is `LOCKED` and the coverage is active.
4. **Execute**: Only after confirmation of the bond does the agent sign and broadcast the transaction.

## 2. Risk Management for Agents

Agents should handle the following scenarios programmatically:

| Scenario | Agent Action |
|---|---|
| **Bond Quote Too High** | If the fee > 30 bps, the agent may choose to decline the bond and warn the user. |
| **Bond Failed to Lock** | Do NOT sign. Abort the transaction. |
| **Coverage Gap** | If the simulator identifies a risk that is "Not Covered" (e.g. extreme slippage), the agent should request explicit user approval. |
| **Settle Outcome** | Post-execution, the agent should check the settlement status to notify the user of bond return or claim payout. |

## 3. API Example (TypeScript)

```typescript
async function secureExecute(tx) {
  // 1. Get structural fingerprint and quote
  const { tx_digest, preview_digest, quote } = await api.declare(tx);

  // 2. Lock the bond
  await program.methods.bondTx(quote.bond_amount).accounts({...}).rpc();

  // 3. Verify lock
  const status = await api.getStatus(tx_digest);
  if (status === 'LOCKED') {
    // 4. Safe to execute
    await signAndSend(tx);
  } else {
    throw new Error("Bond not secured. Aborting for safety.");
  }
}
```
