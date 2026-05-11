import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  TransactionInstruction,
  AccountMeta,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  createMint,
  mintTo,
} from '@solana/spl-token';
import { SOLANA_CLUSTER, RPC_URL, KEYPAIR_PATH, NFT_CONFIG, validateConfig } from '../src/config';
import { loadKeypair, logTransactionSummary, formatPubkey, findMetadataPda } from '../src/utils';

const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq8pJvcapQqkgQbW5fPQ6auWewQP8UVeccP69Gm');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJsyFbPVwwQQfKTwtQtZHHnKwfG');

/**
 * Build a CreateMetadataAccountV3 instruction manually
 * This avoids the need for Umi-based libraries
 */
function buildCreateMetadataInstruction(
  metadataPda: PublicKey,
  mint: PublicKey,
  mintAuthority: PublicKey,
  payer: PublicKey,
  updateAuthority: PublicKey,
  name: string,
  symbol: string,
  uri: string,
): TransactionInstruction {
  // Instruction discriminator for CreateMetadataAccountV3
  const discriminator = Buffer.from([33, 237, 71, 185, 224, 0, 85, 188]);

  // Build the instruction data buffer
  let dataBuffer = Buffer.alloc(1000); // Start with large buffer
  let offset = 0;

  // Add discriminator
  discriminator.copy(dataBuffer, offset);
  offset += discriminator.length;

  // Helper function to write string (length prefix + data)
  const writeString = (str: string) => {
    const strBuf = Buffer.from(str, 'utf-8');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32LE(strBuf.length, 0);
    lenBuf.copy(dataBuffer, offset);
    offset += 4;
    strBuf.copy(dataBuffer, offset);
    offset += strBuf.length;
  };

  // Data struct
  writeString(name);
  writeString(symbol);
  writeString(uri);

  // Seller fee basis points
  const feeBuf = Buffer.alloc(2);
  feeBuf.writeUInt16LE(0, 0);
  feeBuf.copy(dataBuffer, offset);
  offset += 2;

  // Creators: Option (1 byte for Some/None) + length + creators
  const creatorsOption = Buffer.from([1]); // Some
  creatorsOption.copy(dataBuffer, offset);
  offset += 1;

  // Number of creators
  const creatorCount = Buffer.alloc(4);
  creatorCount.writeUInt32LE(1, 0);
  creatorCount.copy(dataBuffer, offset);
  offset += 4;

  // Creator 1
  updateAuthority.toBuffer().copy(dataBuffer, offset);
  offset += 32;

  // Verified
  dataBuffer[offset] = 1;
  offset += 1;

  // Share
  dataBuffer[offset] = 100;
  offset += 1;

  // Collection: None
  const collectionOption = Buffer.from([0]); // None
  collectionOption.copy(dataBuffer, offset);
  offset += 1;

  // Uses: None
  const usesOption = Buffer.from([0]); // None
  usesOption.copy(dataBuffer, offset);
  offset += 1;

  // isMutable
  dataBuffer[offset] = 1;
  offset += 1;

  // collectionDetails: None
  const detailsOption = Buffer.from([0]); // None
  detailsOption.copy(dataBuffer, offset);
  offset += 1;

  // Trim buffer to actual size
  dataBuffer = dataBuffer.slice(0, offset);

  // Build instruction accounts
  const keys: AccountMeta[] = [
    { pubkey: metadataPda, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: mintAuthority, isSigner: true, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: updateAuthority, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    programId: METADATA_PROGRAM_ID,
    keys,
    data: dataBuffer,
  });
}

async function mintNFT(): Promise<void> {
  try {
    validateConfig();

    console.log('🚀 Starting NFT Minting...');
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

    if (balance < 10000000) {
      throw new Error('Insufficient balance. Need at least 0.01 SOL for NFT creation.');
    }

    console.log(`\n📊 NFT Configuration:`);
    console.log(`  Name: ${NFT_CONFIG.name}`);
    console.log(`  Symbol: ${NFT_CONFIG.symbol}`);
    console.log(`  URI: ${NFT_CONFIG.uri}`);

    // Step 1: Create mint for the NFT (decimals = 0 for NFTs)
    console.log('\n⏳ Creating NFT mint...');
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority
      payer.publicKey, // freeze authority
      0, // decimals = 0 for NFTs
    );

    console.log(`✓ Mint created: ${formatPubkey(mint.toString())}`);

    // Step 2: Create associated token account for the NFT
    console.log('⏳ Creating token account for NFT...');
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
    );

    console.log(`✓ Token account created: ${formatPubkey(tokenAccount.address.toString())}`);

    // Step 3: Mint 1 NFT to the token account
    console.log('⏳ Minting NFT...');
    const mintTx = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer.publicKey,
      1, // Mint 1 NFT
    );

    console.log(`✓ NFT minted: ${mintTx}`);

    // Step 4: Create metadata account using raw instruction
    console.log('⏳ Creating metadata account...');

    const metadataPda = findMetadataPda(mint);
    console.log(`  Metadata PDA: ${formatPubkey(metadataPda.toString())}`);

    // Build metadata instruction manually
    const metadataIx = buildCreateMetadataInstruction(
      metadataPda,
      mint,
      payer.publicKey,
      payer.publicKey,
      payer.publicKey,
      NFT_CONFIG.name,
      NFT_CONFIG.symbol,
      NFT_CONFIG.uri,
    );

    const tx = new Transaction().add(metadataIx);
    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log(`✓ Metadata created: ${sig}`);

    // Log summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ NFT Minting Completed Successfully!');
    console.log('='.repeat(60));
    console.log(`  Mint Address: ${mint.toString()}`);
    console.log(`  Token Account: ${tokenAccount.address.toString()}`);
    console.log(`  Metadata PDA: ${metadataPda.toString()}`);
    console.log(`  Owner: ${payer.publicKey.toString()}`);
    console.log(`  Name: ${NFT_CONFIG.name}`);
    console.log(`  Symbol: ${NFT_CONFIG.symbol}`);
    console.log(`  URI: ${NFT_CONFIG.uri}`);
    console.log(`  Standard: Metaplex Token Metadata`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error minting NFT:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

mintNFT();
