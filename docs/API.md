# API Reference

Preview Bond provides an API for bots, agents, and wallets to integrate bonded accountability into their transaction flow.

## 1. HTTP API (Off-Chain)

### `POST /v1/declare`
Simulates a transaction and generates a structural fingerprint.

**Request:**
```json
{
  "unsigned_tx": "base64_encoded_transaction",
  "user_pubkey": "UserPubkey",
  "payout_cap": 100.00
}
```

**Response:**
```json
{
  "tx_digest": "hash_of_tx",
  "preview_digest": "hash_of_fingerprint",
  "fingerprint": {
    "programs": ["ProgId1", "ProgId2"],
    "transfers": [
      { "mint": "USDC", "amount": 10.0, "to": "Addr1" }
    ],
    "authority_changes": []
  },
  "quote": {
    "fee": 0.30,
    "bond_amount": 100.00
  }
}
```

### `GET /v1/status/{tx_digest}`
Checks the current state of a bond.

**Response:**
```json
{
  "status": "LOCKED",
  "expiry": 1726450000,
  "verification_result": null
}
```

## 2. On-Chain Instructions (Anchor)

### `declare_tx`
Registers the intent to bond a transaction.
- **Params**: `tx_digest`, `preview_digest`, `payout_cap`.
- **Accounts**: `User`, `Provider`, `BondAccount`.

### `bond_tx`
Locks the required USDC into the program.
- **Params**: `amount`.
- **Accounts**: `User`, `Provider`, `BondAccount`, `USDC_Mint`, `TokenProgram`.

### `verify_tx`
Keeper submits the result of the execution.
- **Params**: `result (MATCH | MISMATCH)`, `evidence_hash`.
- **Accounts**: `Keeper`, `BondAccount`.

### `settle_tx`
Finalizes the bond.
- **Params**: None.
- **Accounts**: `User`, `Provider`, `BondAccount`.

## 3. Webhooks (Optional)
Providers can register a webhook to be notified when a bond is settled.

**Payload:**
```json
{
  "tx_digest": "hash",
  "outcome": "CLAIM_PAID",
  "amount": 100.00,
  "timestamp": 1726450000
}
```
