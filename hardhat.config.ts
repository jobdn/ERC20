import { task } from "hardhat/config";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import { Contract, Signer } from "ethers";

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
    const owner: Signer = (await hre.ethers.getSigners())[0];
    const ERC20Address: string = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const ERC20Contract: Contract = await hre.ethers.getContractAt(
      "ERC20",
      ERC20Address
    );
    const ERCWithSigner = ERC20Contract.connect(owner);

    await ERCWithSigner.mint(taskArgs.owner, +taskArgs.amount);
    const totalSupply = await ERC20Contract.totalSupply();
    console.log("TOTAL SUPPLY: ", totalSupply);
  });

task("transfer", "Transfer tokens to address")
  .addParam("to", "The account address where tokens are sended")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs, hre, runSuper) => {});

export default {
  solidity: "0.8.4",
};
