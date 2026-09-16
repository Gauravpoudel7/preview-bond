import { PublicKey } from '@solana/web3.js';

export interface TokenTransfer {
  mint: string;
  amount: number;
  from: string;
  to: string;
}

export interface Fingerprint {
  programs: string[];
  transfers: TokenTransfer[];
  authorityChanges: {
    account: string;
    oldAuthority: string;
    newAuthority: string;
  }[];
  mainProgramId: string;
}

export interface VerificationResult {
  isMatch: boolean;
  violatedRule?: 'HIDDEN_TRANSFER' | 'SURPRISE_CPI' | 'AUTHORITY_CHANGE' | 'WRONG_PROGRAM';
  evidence?: string;
}

/**
 * Deterministically compares the actual transaction execution
 * against the expected fingerprint.
 */
export function verifyStructuralMatch(expected: Fingerprint, actual: Fingerprint): VerificationResult {
  // 1. Check: Wrong Program Execution
  if (expected.mainProgramId !== actual.mainProgramId) {
    return {
      isMatch: false,
      violatedRule: 'WRONG_PROGRAM',
      evidence: `Expected ${expected.mainProgramId}, but executed ${actual.mainProgramId}`,
    };
  }

  // 2. Check: Surprise Program (CPI)
  for (const prog of actual.programs) {
    if (!expected.programs.includes(prog)) {
      return {
        isMatch: false,
        violatedRule: 'SURPRISE_CPI',
        evidence: `Unexpected program call: ${prog}`,
      };
    }
  }

  // 3. Check: Hidden Token Transfer
  for (const transfer of actual.transfers) {
    const found = expected.transfers.find(t =>
      t.mint === transfer.mint &&
      t.from === transfer.from &&
      t.to === transfer.to
    );
    if (!found) {
      return {
        isMatch: false,
        violatedRule: 'HIDDEN_TRANSFER',
        evidence: `Unexpected transfer of ${transfer.amount} ${transfer.mint} from ${transfer.from} to ${transfer.to}`,
      };
    }
  }

  // 4. Check: Authority/Ownership Change
  for (const change of actual.authorityChanges) {
    const found = expected.authorityChanges.find(c =>
      c.account === change.account &&
      c.newAuthority === change.newAuthority
    );
    if (!found) {
      return {
        isMatch: false,
        violatedRule: 'AUTHORITY_CHANGE',
        evidence: `Unexpected authority change for ${change.account} to ${change.newAuthority}`,
      };
    }
  }

  return { isMatch: true };
}

/**
 * Calculates the realized financial loss for a user.
 * A mismatch is only payable if loss > 0.
 */
export function calculateRealizedLoss(
  userPubkey: string,
  preBalances: Map<string, number>,
  postBalances: Map<string, number>
): number {
  let totalLoss = 0;

  preBalances.forEach((preAmount, mint) => {
    const postAmount = postBalances.get(mint) || 0;
    if (postAmount < preAmount) {
      totalLoss += (preAmount - postAmount);
    }
  });

  return totalLoss;
}
