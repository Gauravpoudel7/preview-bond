use anchor_lang::prelude::*;

pub mod state;
pub mod errors;

use state::*;
use errors::*;

declare_id!("5Tnm5YgwaL6XPMCGBMQfiwcNfLqNMurqxLJfrgovb2Bi");

#[program]
pub mod preview_bond {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, fee_bps: u16, daily_cap: u64) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.fee_bps = fee_bps;
        config.daily_payout_cap = daily_cap;
        config.current_daily_payout = 0;
        config.last_cap_reset = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn declare_tx(
        ctx: Context<DeclareTx>,
        tx_digest: [u8; 32],
        preview_digest: [u8; 32],
        payout_cap: u64,
    ) -> Result<()> {
        let bond_account = &mut ctx.accounts.bond_account;
        bond_account.provider = ctx.accounts.provider.key();
        bond_account.user = ctx.accounts.user.key();
        bond_account.tx_digest = tx_digest;
        bond_account.preview_digest = preview_digest;
        bond_account.payout_cap = payout_cap;
        bond_account.status = BondStatus::Quoted;
        bond_account.expiry = Clock::get()?.unix_timestamp + 3600; // 1 hour expiry
        bond_account.bump = ctx.bumps.bond_account;

        Ok(())
    }

    pub fn bond_tx(ctx: Context<BondTx>, amount: u64) -> Result<()> {
        let bond_account = &mut ctx.accounts.bond_account;
        require!(bond_account.status == BondStatus::Quoted, PreviewBondError::NotLocked);

        // Status-only: skipping token transfer for demo
        bond_account.amount = amount;
        bond_account.status = BondStatus::Locked;

        Ok(())
    }

    pub fn verify_tx(ctx: Context<VerifyTx>, result: bool, _evidence_hash: [u8; 32]) -> Result<()> {
        let bond_account = &mut ctx.accounts.bond_account;
        require!(bond_account.status == BondStatus::Locked, PreviewBondError::NotLocked);

        if result {
            bond_account.status = BondStatus::VerifiedMatch;
        } else {
            bond_account.status = BondStatus::VerifiedMismatch;
        }

        Ok(())
    }

    pub fn settle_tx(ctx: Context<SettleTx>) -> Result<()> {
        let bond_account = &mut ctx.accounts.bond_account;

        match bond_account.status {
            BondStatus::VerifiedMatch => {
                // Status-only: skipping token refund
                bond_account.status = BondStatus::Released;
            },
            BondStatus::VerifiedMismatch => {
                // Status-only: skipping token payout
                bond_account.status = BondStatus::ClaimPaid;
            },
            _ => return err!(PreviewBondError::NotLocked),
        }

        Ok(())
    }

    pub fn admin_override(ctx: Context<AdminOverride>, new_status: BondStatus) -> Result<()> {
        let bond_account = &mut ctx.accounts.bond_account;
        bond_account.status = new_status;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 8 + 8 + 8 + 2)]
    pub config: Account<'info, GlobalConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(tx_digest: [u8; 32])]
pub struct DeclareTx<'info> {
    #[account(init, payer = user, space = 8 + BondAccount::INIT_SPACE, seeds = [b"bond", tx_digest.as_ref()], bump)]
    pub bond_account: Account<'info, BondAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub provider: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BondTx<'info> {
    #[account(mut)]
    pub bond_account: Account<'info, BondAccount>,
    #[account(mut)]
    pub provider: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyTx<'info> {
    #[account(mut)]
    pub bond_account: Account<'info, BondAccount>,
    pub keeper: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettleTx<'info> {
    #[account(mut)]
    pub bond_account: Account<'info, BondAccount>,
}

#[derive(Accounts)]
pub struct AdminOverride<'info> {
    #[account(mut)]
    pub bond_account: Account<'info, BondAccount>,
    pub admin: Signer<'info>,
    pub config: Account<'info, GlobalConfig>,
}
