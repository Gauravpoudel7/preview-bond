# Preview Bond
**Bonded Accountability for Solana Transaction Previews.**

**⚠️ IMPORTANT: NOT INSURANCE.** Preview Bond is a structural verification proof. It is **not** a financial insurance product and does not provide guaranteed monetary reimbursement. The current localnet demo is **status-only**, meaning it proves the state machine transitions without executing real token transfers.

## 🚀 Local Setup (WSL2 Required)

**Critical Requirement**: If you are on Windows, you **MUST** use **WSL2 (Ubuntu)**. Running Solana toolchains natively on Windows leads to `os error 5` and build failures.

### 1. Prerequisites
- **OS**: WSL2 (Ubuntu 22.04+)
- **Node**: `v18+` with `pnpm`
- **Rust**: `1.75+`
- **Solana CLI**: `v1.17.3`
- **Anchor**: `v0.30.1`

### 2. Installation
```bash
git clone <repo-url>
cd PreviewBond
pnpm install --allow-builds
```

### 3. Deploy to Localnet
```bash
# Start the solana-test-validator in a separate terminal
solana-test-validator

# Set environment variables
export PATH="$HOME/bin:$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$PATH"
export ANCHOR_PROVIDER_URL=http://127.0.0.1:8899
export ANCHOR_WALLET="$HOME/.config/solana/id.json"
solana config set --url localhost

# Build the program
cargo-build-sbf --manifest-path programs/preview-bond/Cargo.toml

# Extend program account size
solana program extend 5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi 2000000

# Deploy to the specific program ID
solana program deploy target/deploy/preview_bond.so --program-id 5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi
```

### 4. Running Proofs
Execute the terminal demos to see the on-chain state machine (`DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`):

```bash
# Honest execution -> Released
pnpm run demo:happy

# Hidden transfer detected -> ClaimPaid
pnpm run demo:attack

# Market slippage (not covered) -> Released
pnpm run demo:slippage
```

### 5. Launching the Judge Demo UI
```bash
pnpm run dev:web
```
Open `http://localhost:5173` to view the interactive control panel.

## 🛠️ Technical Details

### Core Flow
`DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`

### Coverage Scope
**Covered (Structural Tricks):**
- Hidden extra SPL token transfers.
- Surprise CPI (Program calls not in preview).
- Undisclosed Authority/Approval changes.
- Execution of the wrong program.

**NOT Covered:**
- Price volatility / Slippage.
- Wallet private key theft.
- Drains that were already visible in the simulation preview.

### Build Footguns
- **Lockfile**: Uses `Cargo.lock` v3 for compatibility with BPF toolchains.
- **Edition 2024**: Pins `solana-program` and `borsh` to avoid `toml_edit 0.25` errors.

## 📖 Documentation
- [Product Brief](docs/PRODUCT.md)
- [Judge's Demo Kit](docs/JUDGE_DEMO.md)
- [Verification Process](docs/VERIFICATION.md)
- [Demo Script](docs/DEMO.md)
