use anchor_lang::prelude::*;
use crate::state::VaultState;

#[derive(InitSpace)]

#[account]
pub struct VaultState {
  pub vault_bump: u8,
  pub state_bump: u8
}

