# Contributing

We welcome contributions to Preview Bond! Whether it's improving the simulation engine or expanding coverage rules, here is how to get started.

## Development Workflow
1. **Fork & Branch**: Create a feature branch from `main`.
2. **Local Testing**: 
   - Run `solana-test-validator` locally.
   - Use `anchor test` to verify program logic.
3. **PR Requirements**:
   - All new coverage rules must be accompanied by a test case in the `Attack Simulator`.
   - Ensure no "insurance" terminology is added to the documentation.

## Coding Standards
- **Rust/Anchor**: Follow the official Anchor style guide. Use clear error codes for all failure states.
- **TypeScript**: Use strict typing for all API responses and state transitions.

## Issue Labeling
- `bug`: Unexpected behavior in the program or keeper.
- `coverage`: Suggestion for a new structural trick to cover.
- `doc`: Improvement to the documentation.
