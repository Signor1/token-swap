# TokenSwap Contract

The TokenSwap contract is a Solidity smart contract designed to facilitate token swaps between various ERC-20 tokens. It supports swapping between USD and Naira tokens based on a fixed exchange rate. This contract is built using Hardhat for development and testing.

## Overview

- **License:** MIT
- **Solidity Version:** ^0.8.9

## Features

- Allows swapping between ERC-20 tokens, specifically USD and Naira.
- Uses a fixed exchange rate for token swaps.
- Implements the ERC-20 standard for token interaction.
- Developed with Hardhat for testing and deployment.

## Dependencies

This project relies on the following ERC-20 tokens and interfaces:

- **IERC20:** An interface defining the standard functions of an ERC-20 token.
- **USD Token:** An ERC-20 token representing USD.
- **Naira Token:** An ERC-20 token representing Naira.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Compile the contracts: `npx hardhat compile`
4. Run tests: `npx hardhat test`
5. Deploy the contracts: `npx hardhat deploy`

## Usage

Once deployed, you can interact with the TokenSwap contract through its provided functions:

- `swapFromUSDToNaira(uint amountInUSD)`: Swaps USD tokens for Naira tokens.
- `swapFromNairaToUSD(uint amountInNaira)`: Swaps Naira tokens for USD tokens.

Ensure that you have sufficient allowance approved for the contract to spend your tokens.

## Testing

This project includes comprehensive tests to ensure the functionality of the TokenSwap contract. You can run the tests using the following command:

```
npx hardhat test
```

## Contributing

Contributions are welcome! If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Create a new Pull Request.

