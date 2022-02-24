# Basic ERC20 Token contract

This project demonstrates a basic ERC20 Token contract use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

## Deploy
```shell
npx hardhat run scripts/deploy.ts --network <NETWORK>
```

## Tests with solidity-coverage 
```shell
npx hardhat coverage --testfiles "tests/samples-test.ts"
```

## Tasks
To view all tasks run to the terminal:
```shell
npx hardhat 
```

# Etherscan
To check contract in etherscan run: 
```shell
npx hardhat verify --network rinkeby 0xDB72BC0318BAEdA8F533d85a580FBc30d1567CcB "ERC20 Token" "ERC20T" 100
```

Where "ERC20 Token" it is **name** of ERC20 tokens, "ERC20T" it is **symbol** and 100 it is **decimals**