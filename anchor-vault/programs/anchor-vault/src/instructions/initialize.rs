use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize {
    #[account(mut)]
    pub user: Signer<'info>

    #[account{
        init,
        payer = user
        seeds = {b"state", user.key().as_ref()},
        bump,
        space = 8 + VaultState::INIT_SPACE
    }]
    pub vault_state: Account<'info, VaultState>

    #[account{
        seeds = [b"vault", user.key().as_ref()],
        bump
    }]
    pub vault: SystemAccount<'info>

    pub system_program: Program<'info, System>
}

impl<'info> Initialize<'info>, {
    pub fn initialize(&mut self, bumps: &InitializeBump) => Result<()> {
       // Save to state
       self.vault_state.vault_bump = bumps.vault;
       self.vault_state.state_bump = bumps.vault_states;
    }
}