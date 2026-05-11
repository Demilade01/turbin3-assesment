# Guessing Game 🎮

A simple but fun interactive number guessing game built with Rust. The computer picks a random number between 1 and 100, and you have to guess it!

## How to Play

1. The game picks a random secret number between 1 and 100
2. You're prompted to input your guess
3. The game tells you if your guess is too small, too big, or correct
4. Keep guessing until you find the right number
5. Type `quit` or press Ctrl+C to exit anytime

### Example Session

```
Guess the number!
Please input your guess.
50
You guessed: 50
Too big!
Please input your guess.
25
You guessed: 25
Too small!
Please input your guess.
37
You guessed: 37
You win!
```

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) installed on your system
- Cargo (comes automatically with Rust)

## Building

Navigate to the project directory and build the project:

```bash
cd guessing_game

# Debug build
cargo build

# Release build (optimized)
cargo build --release
```

The compiled binary will be located at:
- Debug: `target/debug/guessing_game` (or `.exe` on Windows)
- Release: `target/release/guessing_game` (or `.exe` on Windows)

## Running

### Run directly with Cargo

```bash
cargo run
```

This will compile and run the game in one command.

### Run the compiled binary

```bash
# Debug version
./target/debug/guessing_game

# Release version (faster)
./target/release/guessing_game
```

On Windows, use `.exe` extension:

```bash
.\target\debug\guessing_game.exe
```

## Project Structure

```
guessing_game/
├── src/
│   └── main.rs           # Main game logic
├── Cargo.toml            # Project manifest
├── Cargo.lock            # Locked dependency versions
└── target/               # Build output
    ├── debug/            # Debug build artifacts
    └── release/          # Release build artifacts
```

## Code Overview

### Main Components

The game demonstrates several key Rust concepts:

```rust
// 1. Using external crates
use rand::Rng;

// 2. String and I/O
let mut guess = String::new();
io::stdin().read_line(&mut guess).expect("Failed to read line");

// 3. Parsing and error handling
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,  // Skip invalid input
};

// 4. Pattern matching
match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal => {
        println!("You win!");
        break;  // Exit loop
    }
}
```

## Concepts Covered

This project teaches the following Rust fundamentals:

### 1. **Variables and Mutability**
```rust
let secret_number = rand::thread_rng().gen_range(1..=100);  // Immutable
let mut guess = String::new();  // Mutable
```

### 2. **Functions and Main Entry Point**
```rust
fn main() {
    // Entry point of the program
}
```

### 3. **Input/Output (I/O)**
```rust
use std::io;
io::stdin().read_line(&mut guess)
```

### 4. **Control Flow**
- **Loops**: `loop { }` - Runs until `break` is called
- **Conditionals**: `if`/`else` patterns via `match`

### 5. **Pattern Matching**
```rust
match guess.cmp(&secret_number) {
    Ordering::Less => { /* ... */ },
    Ordering::Greater => { /* ... */ },
    Ordering::Equal => { /* ... */ },
}
```

### 6. **Error Handling**
```rust
// Using expect() for simple error handling
.read_line(&mut guess).expect("Failed to read line")

// Using match for more control
match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,  // Skip on error
}
```

### 7. **Type Conversion**
```rust
let guess: u32 = guess.trim().parse()?;  // String -> u32
```

### 8. **Using External Crates**
```rust
use rand::Rng;
rand::thread_rng().gen_range(1..=100)
```

## Dependencies

The project uses one external crate:

- **`rand`** (v0.8.5) - For generating random numbers

Check [Cargo.toml](./Cargo.toml) for the full dependency declaration.

## Troubleshooting

### Compilation Issues

**Error: `edition 2024 is not stable`**

The Cargo.toml specifies edition `2024` which may not be available. Update it to a stable edition:

```toml
# Change from
edition = "2024"

# To
edition = "2021"  # or "2018"
```

### Runtime Issues

**Script hangs waiting for input**
- This is normal! The game is waiting for you to type a number and press Enter

**Invalid input handling**
- If you enter something that's not a number, the game will ask you to guess again
- Non-numeric input is silently ignored due to `Err(_) => continue`

**Random number always the same**
- This shouldn't happen as `rand::thread_rng()` creates a new random generator each run
- If it does, try rebuilding with `cargo clean && cargo build`

## Performance

### Build Times

```bash
# First build (downloads dependencies)
cargo build       # ~2-5 seconds

# Rebuild (cached)
cargo build       # <1 second

# Release build (optimized, slower to compile)
cargo build --release  # ~5-10 seconds
```

### Runtime Performance

The game is extremely fast:
- Guess validation: < 1ms
- Random number generation: < 1μs
- I/O operations: Depends on user input speed

## Testing

The project doesn't include automated tests, but you can manually test:

```bash
# Test with valid input
cargo run
# Input: 50, 25, 37, etc.

# Test with invalid input
cargo run
# Input: abc, 12a, -5, etc.
```

## Extending the Game

Here are some ideas to enhance the game:

### 1. **Display remaining attempts**
```rust
let mut attempts = 0;
let max_attempts = 10;

loop {
    attempts += 1;
    if attempts > max_attempts {
        println!("Game over! You've used all attempts.");
        break;
    }
}
```

### 2. **Show range hints**
```rust
println!("You've guessed higher. Try between 1 and {}", guess - 1);
```

### 3. **Track statistics**
```rust
let mut games_played = 0;
let mut total_guesses = 0;
```

### 4. **Difficulty levels**
```rust
let max_number = match difficulty {
    "easy" => 50,
    "medium" => 100,
    "hard" => 1000,
};
```

### 5. **Multiple rounds**
```rust
loop {
    // Play one round
    // Ask if player wants to play again
}
```

## Learning Resources

- [The Rust Book - Guessing Game Tutorial](https://doc.rust-lang.org/book/ch02-00-programming-a-guessing-game.html)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Cargo Book](https://doc.rust-lang.org/cargo/)
- [Rand Crate Documentation](https://docs.rs/rand/)

## License

MIT

## Contributing

Feel free to fork, modify, and submit improvements!
