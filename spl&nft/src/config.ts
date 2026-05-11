import * as dotenv from 'dotenv';

dotenv.config();

export type SolanaCluster = 'devnet' | 'testnet' | 'mainnet-beta';

export const SOLANA_CLUSTER = (process.env.SOLANA_CLUSTER || 'devnet') as SolanaCluster;

export const RPC_ENDPOINTS: Record<SolanaCluster, string> = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
};

export const RPC_URL = process.env.SOLANA_RPC_URL || RPC_ENDPOINTS[SOLANA_CLUSTER];

export const KEYPAIR_PATH = process.env.KEYPAIR_PATH;

// Token Configuration
export const TOKEN_CONFIG = {
  decimals: parseInt(process.env.TOKEN_DECIMALS || '9'),
  name: process.env.TOKEN_NAME || 'My Token',
  symbol: process.env.TOKEN_SYMBOL || 'MYTOKEN',
};

// NFT Configuration
export const NFT_CONFIG = {
  name: process.env.NFT_NAME || 'My NFT',
  symbol: process.env.NFT_SYMBOL || 'MYNFT',
  uri: process.env.NFT_URI || 'https://example.com/metadata.json',
};

// Validate required environment variables
export function validateConfig(): void {
  if (!KEYPAIR_PATH) {
    throw new Error('KEYPAIR_PATH environment variable is not set');
  }
}
