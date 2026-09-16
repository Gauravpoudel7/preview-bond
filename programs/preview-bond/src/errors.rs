use anchor_lang::prelude::*;

#[error_code]
pub enum PreviewBondError {
    #[msg("The bond has already been settled.")]
    AlreadySettled,
    #[msg("The bond has expired.")]
    BondExpired,
    #[msg("Insufficient funds to lock the bond.")]
    InsufficientBondFunds,
    #[msg("Invalid attestation from keeper.")]
    InvalidAttestation,
    #[msg("The requested claim exceeds the payout cap.")]
    ExceedsPayoutCap,
    #[msg("Daily payout limit reached.")]
    DailyCapReached,
    #[msg("Only the authorized keeper can verify this transaction.")]
    UnauthorizedKeeper,
    #[msg("Bond is not in the Locked state.")]
    NotLocked,
}
