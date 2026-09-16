# Verification Guide

This guide provides the technical steps required to audit the Preview Bond implementation and verify the "Holy Grail" scenarios on a working Solana toolchain.

## 🛠️ Environment Requirements
To execute these tests, you need a machine with:
- **OS**: Linux or WSL2 (Ubuntu) is strongly recommended.
- **Toolchain**: `solana-cli`, `anchor-cli`, and `pnpm`.
- **Validator**: A running `solana-test-validator`.

## 🚀 Step-by-Step Audit Flow

### 1. Environment Setup
```bash
# Install dependencies
pnpm install

# Build the program
anchor build

# Start validator in a separate terminal
solana-test-validator --reset
```

### 2. Running the Integration Suite
The most comprehensive proof is the `bond_lifecycle.ts` test.
```bash
anchor test
```
**Expected Output**:
- `Scenario A: Happy Path` $\rightarrow$ **PASS**
- `Scenario B: Attack Path` $\rightarrow$ **PASS**
- `Scenario C: Boundary Path` $\rightarrow$ **PASS**

### 3. Manual Scenario Verification (CLI)
You can run the individual demo scripts to see the logs in real-time:

#### A. The Happy Path
```bash
pnpm run demo:happy
```
- **Expected**: `Settle` $\rightarrow$ `BondStatus.Released`.
- **Verification**: Check that the Provider's USDC balance increased (minus 30 bps fee).

#### B. The Attack Path (The "Wow" Moment)
```bash
pnpm run demo:attack
```
- **Expected**: `Settle` $\rightarrow$ `BondStatus.ClaimPaid`.
- **Verification**: 
    1. Check logs for `MISMATCH DETECTED`.
    2. Verify that the User's USDC balance increased by the payout amount.
    3. Confirm the `tx_digest` matched the bound commitment.

#### C. The Slippage Boundary
```bash
pnpm run demo:slippage
```
- **Expected**: `Settle` $\rightarrow$ `BondStatus.Released`.
- **Verification**: 
    1. Check logs for `MATCH` (structural).
    2. Confirm that despite financial loss, the bond was **not** paid to the user.

## 🔍 Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `Access is denied (os error 5)` | Windows permissions | Move to WSL2 or run terminal as Administrator. |
| `Invalid Base58 string` | Anchor.toml placeholder | Ensure `preview_bond` ID in `Anchor.toml` matches the deployed keypair. |
| `BondExpired` | Clock skew | Ensure `solana-test-validator` is running and current. |
| `InsufficientFunds` | No Mock USDC | Run the `before` hook in `bond_lifecycle.ts` to mint mock USDC. |
