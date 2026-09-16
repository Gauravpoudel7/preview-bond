use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum BondStatus {
    Quoted,
    Locked,
    VerifiedMatch,
    VerifiedMismatch,
    Released,
    ClaimPaid,
    NotCovered,
    EvidencePending,
    Disputed,
    Denied,
}

#[account]
#[derive(InitSpace)]
pub struct BondAccount {
    pub provider: Pubkey,
    pub user: Pubkey,
    pub tx_digest: [u8; 32],
    pub preview_digest: [u8; 32],
    pub amount: u64,
    pub payout_cap: u64,
    pub status: BondStatus,
    pub expiry: i64,
    pub bump: u8,
}

#[account]
pub struct GlobalConfig {
    pub admin: Pubkey,
    pub daily_payout_cap: u64,
    pub current_daily_payout: u64,
    pub last_cap_reset: i64,
    pub fee_bps: u16, // 30 bps
}
