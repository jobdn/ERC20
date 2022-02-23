import { task } from "hardhat/config";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import { BigNumber, Contract, Signer } from "ethers";
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "./.env") });

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

task("mint", "Mint tokens to address")
  .addParam("owner", "Owner of tokens")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs, hre, runSuper) => {
    const owner: Signer = (await hre.ethers.getSigners())[1];
    const ERC20Address: string = process.env.ERC_ADDRESS?.toString() as string;

    const ERC20Contract: Contract = await hre.ethers.getContractAt(
      "ERC20",
      // TODO: adding the address
      "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    );
    const ERCWithSigner = ERC20Contract.connect(owner);

    await ERCWithSigner.mint(taskArgs.owner, +taskArgs.amount);
    const totalSupply: BigNumber = await ERCWithSigner.totalSupply();
    console.log("TOTAL SUPPLY: ", totalSupply.toNumber());
  });

task("transfer", "Transfer tokens to address")
  .addParam("to", "The account address where tokens are sended")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs, hre, runSuper) => {});

export default {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_PRIVATE_KEY}`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
