import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createMintToInstruction,
  getOrCreateAssociatedTokenAccount,
  createMint,
  mintTo,
} from '@solana/spl-token';
import { SOLANA_CLUSTER, RPC_URL, KEYPAIR_PATH, TOKEN_CONFIG, validateConfig } from '../src/config';
import { loadKeypair, logTransactionSummary, formatPubkey } from '../src/utils';

async function mintToken(): Promise<void> {
  try {
    validateConfig();

    console.log('🚀 Starting SPL Token Minting...');
    console.log(`📍 Network: ${SOLANA_CLUSTER}`);
    console.log(`🔗 RPC URL: ${RPC_URL}`);

    // Initialize connection
    const connection = new Connection(RPC_URL, 'confirmed');

    // Load payer keypair
    const payer = loadKeypair(KEYPAIR_PATH!);
    console.log(`💳 Payer: ${formatPubkey(payer.publicKey.toString())}`);

    // Get payer balance
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`💰 Balance: ${(balance / 1000000000).toFixed(4)} SOL`);

    if (balance < 5000000) {
      throw new Error('Insufficient balance. Need at least 0.005 SOL for token creation.');
    }

    console.log(`\n📊 Token Configuration:`);
    console.log(`  Name: ${TOKEN_CONFIG.name}`);
    console.log(`  Symbol: ${TOKEN_CONFIG.symbol}`);
    console.log(`  Decimals: ${TOKEN_CONFIG.decimals}`);

    // Create mint
    console.log('\n⏳ Creating mint...');
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority
      payer.publicKey, // freeze authority
      TOKEN_CONFIG.decimals,
    );

    console.log(`✓ Mint created: ${formatPubkey(mint.toString())}`);

    // Get or create associated token account
    console.log('⏳ Creating associated token account...');
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
    );

    console.log(`✓ Token account created: ${formatPubkey(tokenAccount.address.toString())}`);

    // Mint tokens
    const initialSupply = 1000 * Math.pow(10, TOKEN_CONFIG.decimals); // 1000 tokens
    console.log(`⏳ Minting ${1000} tokens...`);

    const mintTx = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer.publicKey,
      initialSupply,
    );

    console.log(`✓ Tokens minted: ${mintTx}`);

    // Log summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ SPL Token Created Successfully!');
    console.log('='.repeat(60));
    console.log(`  Mint Address: ${mint.toString()}`);
    console.log(`  Token Account: ${tokenAccount.address.toString()}`);
    console.log(`  Owner: ${payer.publicKey.toString()}`);
    console.log(`  Initial Supply: 1000 ${TOKEN_CONFIG.symbol}`);
    console.log(`  Decimals: ${TOKEN_CONFIG.decimals}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error minting token:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

mintToken();
