import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { config } from "../config";

task("transferFrom", "Transfer tokens from address to another address")
  .addParam("from", "Address from which token will be spent")
  .addParam("to", "Address to which token will be sent")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    const owner: Signer = (await hre.ethers.getSigners())[0];
    const ERC20Contract = await hre.ethers.getContractAt("ERC20", config.ERC_ADDRESS);
    const ERC20WithSigner = ERC20Contract.connect(owner);

    await ERC20WithSigner.transferFrom(
      taskArgs.from,
      taskArgs.to,
      taskArgs.amount
    );

    const fromBalance = (
      await ERC20Contract.balanceOf(taskArgs.from)
    ).toNumber();
    const toBalance = (await ERC20Contract.balanceOf(taskArgs.to)).toNumber();
    console.log(`Balance of ${taskArgs.from} :`, fromBalance);
    console.log(`Balance of ${taskArgs.to} :`, toBalance);
  });
