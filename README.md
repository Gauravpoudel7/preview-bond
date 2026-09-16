# Preview Bond

**A structural verification proof for Solana transaction previews.**

Preview Bond provides **bonded accountability** for transaction previews. It proves that a transaction's actual execution matches its simulated structural fingerprint, ensuring no hidden "tricks" (like undisclosed token transfers or authority changes) were used to drain funds.

> **⚠️ IMPORTANT: NOT INSURANCE.** This project is a structural verification proof. It is NOT a financial insurance product and does not provide guaranteed monetary reimbursement. The current localnet demo is **status-only**, meaning it proves the state machine transitions without executing real USDC transfers.

## 🚀 Local Setup (WSL2 Required)

**Critical Requirement**: If you are on Windows, you **MUST** use **WSL2 (Ubuntu)**. Running Solana toolchains natively on Windows often leads to `os error 5` (Access Denied) and build failures.

### 1. Prerequisites
- **OS**: WSL2 (Ubuntu 22.04+)
- **Node**: `v18+` with `pnpm`
- **Rust**: `1.75+`
- **Solana CLI**: `v1.17.3` (Compatible with this project's `solana-program` pin)
- **Anchor**: `v0.30.1`

### 2. Installation
```bash
# Clone and enter project
git clone <repo-url>
cd PreviewBond

# Install dependencies
# allowBuilds is required for some native modules
pnpm install --allow-builds
```

### 3. Deploy to Localnet
```bash
# Start the solana-test-validator in a separate terminal
solana-test-validator

# In your main terminal, set environment variables
export PATH="$HOME/bin:$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$PATH"
export ANCHOR_PROVIDER_URL=http://127.0.0.1:8899
export ANCHOR_WALLET="$HOME/.config/solana/id.json"
solana config set --url localhost

# Build the program (Prefer cargo-build-sbf over anchor build to avoid toolchain downgrades)
cargo-build-sbf --manifest-path programs/preview-bond/Cargo.toml

# Extend program account size to avoid "AccountNotEnoughKeys"
solana program extend 5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi 2000000

# Deploy to the specific program ID
solana program deploy target/deploy/preview_bond.so --program-id 5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi
```

### 4. Running Proofs
Execute the terminal demos to see the on-chain state machine in action:

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
# Run the Vite-based demo UI
pnpm run dev:web # or pnpm run dev (depending on package.json)
```
Open `http://localhost:5173` (or provided port) to view the interactive control panel.

## 🛠️ Technical Details

### Core Flow
`DECLARE` $\rightarrow$ `BOND` $\rightarrow$ `EXECUTE` $\rightarrow$ `VERIFY` $\rightarrow$ `SETTLE`

### Build Footguns
- **Lockfile**: This project uses `Cargo.lock` version 3 for compatibility with older BPF toolchains.
- **Edition 2024**: We pin `solana-program` and `borsh` to avoid `toml_edit 0.25` / `edition2024` errors during `cargo-build-sbf`.

## 📖 Documentation
- [Product Brief](docs/PRODUCT.md) - Positioning and scope.
- [Judge's Demo Kit](docs/JUDGE_DEMO.md) - Talk track and flow.
- [Verification Process](docs/VERIFICATION.md) - Technical details of the 4 structural checks.
- [Demo Script](docs/DEMO.md) - Step-by-step localnet proof.

---
*Built for the Colosseum / Crypto World's Fair Hackathon.*
