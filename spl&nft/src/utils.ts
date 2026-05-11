import * as fs from 'fs';
import * as path from 'path';
import { Keypair, PublicKey } from '@solana/web3.js';

const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq8pJvcapQqkgQbW5fPQ6auWewQP8UVeccP69Gm');

/**
 * Load a keypair from a file path
 * @param keypairPath - Path to the keypair JSON file
 * @returns Keypair object
 */
export function loadKeypair(keypairPath: string): Keypair {
  const absolutePath = path.resolve(keypairPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Keypair file not found at: ${absolutePath}`);
  }

  const keypairData = fs.readFileSync(absolutePath, 'utf-8');
  const keypairArray = JSON.parse(keypairData);

  if (!Array.isArray(keypairArray) || keypairArray.length !== 64) {
    throw new Error('Invalid keypair format. Expected an array of 64 bytes.');
  }

  return Keypair.fromSecretKey(Buffer.from(keypairArray));
}

/**
 * Format a public key for display
 * @param pubkey - Public key to format
 * @returns Shortened public key string
 */
export function formatPubkey(pubkey: string): string {
  return `${pubkey.substring(0, 4)}...${pubkey.substring(pubkey.length - 4)}`;
}

/**
 * Log a transaction summary
 * @param label - Description of what was created
 * @param address - Address of created item
 */
export function logTransactionSummary(label: string, address: string): void {
  console.log(`\n✓ ${label} created successfully`);
  console.log(`  Address: ${address}`);
}

/**
 * Find Metadata PDA for a given mint
 * @param mint - The mint address
 * @returns PublicKey of the metadata account
 */
export function findMetadataPda(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
  return pda;
}
