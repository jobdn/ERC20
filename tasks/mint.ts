import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { BigNumber, Contract, ethers, Signer } from "ethers";

import { ERC_ADDRESS } from "../config";

task("mint", "Mint tokens to address")
  .addParam("owner", "Owner of tokens")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    const owner: Signer = (await hre.ethers.getSigners())[0];

    const ERC20Contract: Contract = await hre.ethers.getContractAt(
      "ERC20",
      ERC_ADDRESS
    );
    const ERCWithSigner = ERC20Contract.connect(owner);

    await ERCWithSigner.mint(taskArgs.owner, taskArgs.amount);

    const totalSupply: BigNumber = (
      await ERC20Contract.totalSupply()
    ).toNumber();
    const ownerBalance: BigNumber = (
      await ERC20Contract.balanceOf(taskArgs.owner)
    ).toNumber();

    console.log("Total supply: ", totalSupply);
    console.log(`Balance of ${taskArgs.owner}: `, ownerBalance);
  });
