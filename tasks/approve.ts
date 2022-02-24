import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { config } from "../config";

task("approve")
  .addParam("spender", "Address which will spend tokens")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    const owner : Signer = (await hre.ethers.getSigners())[0];
    const ERC20Contract = await hre.ethers.getContractAt("ERC20", config.ERC_ADDRESS);
    const ERC20WithSigner = ERC20Contract.connect(owner);

    await ERC20WithSigner.approve(taskArgs.spender, taskArgs.amount);
    console.log(`Account ${taskArgs.spender} can spend ${taskArgs.amount} of tokens from ${await owner.getAddress()}`);    
  });
