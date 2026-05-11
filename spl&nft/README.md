# SPL Token & NFT Minting Scripts 💎

TypeScript scripts for minting SPL tokens and NFTs on the Solana blockchain using [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) and [Metaplex Token Metadata](https://github.com/metaplex-foundation/mpl-token-metadata).

## Overview

This project provides two main executable scripts:

- **`mint-token.ts`**: Creates and mints an SPL token
- **`mint-nft.ts`**: Creates and mints an NFT with Metaplex Token Metadata

## Features

✅ **SPL Token Minting**
- Create new token mints with configurable decimals
- Generate associated token accounts (ATA)
- Mint initial token supply
- Full transaction confirmation

✅ **NFT Minting**
- Create NFT mint (0 decimals)
- Attach Metaplex Token Metadata
- Configure name, symbol, and metadata URI
- Set creator and royalty information

✅ **Network Support**
- Devnet (testing)
- Testnet
- Mainnet-beta (production)

✅ **Configuration**
- Environment-based setup
- Keypair management
- Balance validation
- Error handling with detailed messages

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn
- A Solana wallet keypair (JSON file)
- SOL tokens for network fees

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Configuration

Edit `.env` with your settings:

```env
# Network: devnet, testnet, or mainnet-beta
SOLANA_CLUSTER=devnet

# RPC Endpoint (optional - uses default for cluster if not set)
SOLANA_RPC_URL=https://api.devnet.solana.com

# Path to your keypair JSON file
KEYPAIR_PATH=/path/to/keypair.json

# Token Configuration
TOKEN_NAME=My Token
TOKEN_SYMBOL=MYTOKEN
TOKEN_DECIMALS=9

# NFT Configuration
NFT_NAME=My NFT
NFT_SYMBOL=MYNFT
NFT_URI=https://example.com/metadata.json
```

## Usage

### Mint an SPL Token

```bash
npm run mint:token
```

**Output:**
```
🚀 Starting SPL Token Minting...
📍 Network: devnet
🔗 RPC URL: https://api.devnet.solana.com
💳 Payer: 4ABC...7XyZ
💰 Balance: 2.5000 SOL
...
✅ SPL Token Created Successfully!
  Mint Address: ABC123...
  Token Account: DEF456...
  Initial Supply: 1000 MYTOKEN
```

### Mint an NFT

```bash
npm run mint:nft
```

**Output:**
```
🚀 Starting NFT Minting...
📍 Network: devnet
🔗 RPC URL: https://api.devnet.solana.com
💳 Payer: 4ABC...7XyZ
💰 Balance: 2.5000 SOL
...
✅ NFT Minting Completed Successfully!
  Mint Address: ABC123...
  Token Account: DEF456...
  Metadata PDA: GHI789...
  Name: My NFT
  Symbol: MYNFT
```

## Project Structure

```
spl&nft/
├── scripts/                    # Executable scripts
│   ├── mint-token.ts          # SPL token minting logic
│   └── mint-nft.ts            # NFT minting logic
├── src/                        # Source code
│   ├── config.ts              # Configuration management
│   └── utils.ts               # Helper functions
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment template
└── README.md                  # This file
```

## Dependencies

- **@solana/web3.js** - Core Solana blockchain interaction
- **@solana/spl-token** - SPL Token Program helpers
- **@metaplex-foundation/mpl-token-metadata** - Token Metadata standard
- **dotenv** - Environment variable management
- **typescript** - TypeScript compiler
- **ts-node** - TypeScript execution

## How It Works

### SPL Token Minting

1. **Initialize Connection** - Connect to Solana RPC endpoint
2. **Load Keypair** - Load wallet from keypair file
3. **Create Mint** - Call Token Program to create new mint
4. **Create ATA** - Generate Associated Token Account
5. **Mint Tokens** - Mint initial supply to the ATA
6. **Confirm & Log** - Wait for confirmation and display results

### NFT Minting

1. **Initialize Connection** - Connect to Solana RPC endpoint
2. **Load Keypair** - Load wallet from keypair file
3. **Create Mint** - Create mint with 0 decimals (NFT standard)
4. **Create Token Account** - Generate account for the NFT
5. **Mint NFT** - Mint 1 token (the NFT)
6. **Create Metadata** - Build and send CreateMetadataAccountV3 instruction
7. **Confirm & Log** - Wait for confirmation and display transaction details

**Note:** The metadata instruction is built manually using raw transaction construction to avoid Umi dependency overhead for simple scripts.

## Keypair Management

### Generate a New Keypair

Using Solana CLI:

```bash
solana-keygen new --outfile ~/my-keypair.json
```

Using web3.js:

```javascript
const { Keypair } = require('@solana/web3.js');
const keypair = Keypair.generate();
const secretKey = Array.from(keypair.secretKey);
console.log(JSON.stringify(secretKey));
```

### Request Test SOL

On devnet:

```bash
solana airdrop 2 <YOUR_ADDRESS> --url devnet
```

Or use the [Solana Faucet](https://faucet.solana.com/).

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `Keypair file not found` | Invalid KEYPAIR_PATH | Check .env and file path |
| `Insufficient balance` | Not enough SOL | Request test SOL via faucet |
| `RPC request failed` | Network issue | Check RPC URL and network status |
| `Transaction failed` | Blockchain error | Check account permissions and balance |

## Building for Production

```bash
# Compile TypeScript
npm run build

# Output goes to dist/
```

## Testing

Always test on **devnet** first before mainnet:

```bash
SOLANA_CLUSTER=devnet npm run mint:token
SOLANA_CLUSTER=devnet npm run mint:nft
```

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file (already in .gitignore)
- Never share your keypair JSON file
- Always test on devnet before mainnet
- Double-check transaction fees before confirming
- Use hardware wallets for production accounts

## Troubleshooting

### Script hangs after "Creating mint..."

This usually means transaction confirmation is taking too long. Try:

```bash
# Check network status
solana cluster-version --url https://api.devnet.solana.com

# Retry with longer timeout
# (May need to modify connection settings in src/config.ts)
```

### Metadata instruction fails

Ensure the metadata PDA is derived correctly. The script uses `PublicKey.findProgramAddressSync()` with:

- `metaqbxxUerdq8pJvcapQqkgQbW5fPQ6auWewQP8UVeccP69Gm` (Metadata Program)
- Seeds: `["metadata", METADATA_PROGRAM_ID, MINT_ADDRESS]`

## Learning Resources

- [Solana Documentation](https://solana.com/docs)
- [web3.js API Reference](https://solana-labs.github.io/solana-web3.js/)
- [SPL Token Program](https://spl.solana.com/token)
- [Metaplex Documentation](https://docs.metaplex.com/)
- [Solana Cookbook](https://solana.com/developers/cookbook)

## License

MIT

## Contributing

Feel free to submit issues or improvements!
