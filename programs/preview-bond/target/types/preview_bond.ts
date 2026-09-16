import { BN, Program, Account, AccountMeta } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type BondStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // Enum for BondStatus

export interface BondAccount {
  provider: PublicKey;
  user: PublicKey;
  txDigest: Buffer;
  previewDigest: Buffer;
  amount: BN;
  payoutCap: BN;
  status: BondStatus;
  expiry: number;
  bump: number;
}

export interface GlobalConfig {
  admin: PublicKey;
  dailyPayoutCap: BN;
  currentDailyPayout: BN;
  lastCapReset: number;
  feeBps: number;
}

export interface PreviewBond {
  declareTx: (txDigest: Buffer, previewDigest: Buffer, payoutCap: BN) => Promise<void>;
  bondTx: (amount: BN) => Promise<void>;
  verifyTx: (result: boolean, evidenceHash: Buffer) => Promise<void>;
  settleTx: () => Promise<void>;
  adminOverride: (newStatus: BondStatus) => Promise<void>;
  initializeConfig: (feeBps: number, dailyCap: BN) => Promise<void>;
}
