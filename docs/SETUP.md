# Setup Guide

Follow these steps to set up the Preview Bond development environment.

## 1. Prerequisites

Ensure you have the following installed:
- **Rust**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Solana CLI**: Follow the [official installation guide](https://docs.solana.com/cli/install-solana-cli-tools).
- **Anchor Framework**: `avm install latest`
- **Node.js & pnpm**: `npm install -g pnpm`

## 2. Local Environment Configuration (Windows Workarounds)

If you are on Windows, you may encounter `Access is denied (os error 5)` when running the validator or building with Anchor.

### Recommended: Use WSL2 (Ubuntu)
The most stable way to develop for Solana on Windows is using **WSL2**. Install Ubuntu from the Microsoft Store, then repeat the prerequisites inside the Linux terminal.

### Windows Native Workarounds
If you must stay on Windows native:
1. **Run as Administrator**: Open your terminal (PowerShell/CMD) as an Administrator. This is often required for the initial toolchain install.
2. **Custom Ledger Path**: Avoid the default ledger location if you have permission issues. Use a path in your user directory:
   ```powershell
   solana-test-validator --ledger $env:TEMP\pb-ledger --reset
   ```
3. **User-Directory Installation**: Ensure Solana tools are installed in your user directory (e.g., `.solana`) rather than `C:\Program Files`.

### Initialize Wallet
```bash
solana-keygen new
solana config set --url localhost
```

## 3. Build and Deploy

### Deploy the Program
```bash
anchor build
anchor deploy
```
*Note: Update your `.env` file with the Program ID printed in the terminal.*

### Install & Run Backend
```bash
pnpm install
pnpm run start:backend
```

### Launch Frontend
```bash
pnpm run dev
```
