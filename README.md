# Turbin3 Assessment - Learning Journey 🦀

Welcome to my Turbin3 learning repository! This folder contains various projects as I work through learning Rust and Solana blockchain development.

## Project Structure

```
turbin3/
├── guessing_game/          # A classic number guessing game - Rust beginner project
└── spl&nft/                # SPL token and NFT minting scripts - Solana project
```

## Projects

### 🎮 Guessing Game (Rust)
A beginner-friendly interactive number guessing game to practice Rust fundamentals.

**Concepts Covered:**
- Variables and mutability
- Functions
- Input/Output
- Control flow (if/else, loops)
- Error handling

**Getting Started:**
```bash
cd guessing_game
cargo run
```

### 💎 SPL Token & NFT Minting (Solana + TypeScript)
TypeScript scripts to mint SPL tokens and NFTs on the Solana blockchain using web3.js and Metaplex Token Metadata.

**Features:**
- ✅ Create SPL tokens with custom metadata
- ✅ Mint NFTs with Metaplex Token Metadata
- ✅ Support for devnet, testnet, and mainnet-beta
- ✅ Environment-based configuration
- ✅ Keypair management and transaction confirmation

**Quick Start:**
```bash
cd spl&nft
npm install
cp .env.example .env
# Configure .env with your settings
npm run mint:token   # Mint an SPL token
npm run mint:nft     # Mint an NFT
```

For detailed instructions, see [spl&nft/README.md](./spl&nft/README.md).

## Prerequisites

### For Rust Projects
- [Rust](https://www.rust-lang.org/tools/install) installed on your system
- Cargo (comes with Rust)

### For Solana Projects
- [Node.js](https://nodejs.org/) (v18+)
- npm or yarn
- A Solana wallet with test SOL (for devnet)

## Building and Running

### Rust Projects
```bash
cd [project-name]
cargo build
cargo run
```

### Node.js/TypeScript Projects
```bash
cd [project-name]
npm install
npm run build
npm run [script-name]
```

## Learning Progress

This repository tracks my journey through Rust fundamentals, including:
- ✅ Basic syntax and variables
- ✅ Functions and control flow
- 🔄 Error handling and Result types
- 🔄 Ownership and borrowing concepts
- 🔄 Collections (Vec, HashMap, etc.)
- ⏳ Structs and pattern matching
- ⏳ Traits and generics
- ⏳ Closures and iterators
- ⏳ Modules and packages

## Resources

- [Official Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Cargo Guide](https://doc.rust-lang.org/cargo/)

## Notes

This repository is part of my turbine assessment while learning Rust. Each project builds upon previous concepts and gradually increases in complexity.

---

**Last Updated:** May 2026
**Status:** 🚀 In Progress
