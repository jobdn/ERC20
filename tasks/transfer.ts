import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { config } from "../config";

task("transfer")
  .addParam("to", "Address which tokens will be sended")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    const owner: SignerWithAddress = (await hre.ethers.getSigners())[0];
    const ERC20Contract = await hre.ethers.getContractAt(
      "ERC20",
      config.ERC_ADDRESS
    );
    const ERC20WithSigner = ERC20Contract.connect(owner);

    await ERC20WithSigner.transfer(taskArgs.to, taskArgs.amount);
    const toBalance = (await ERC20Contract.balanceOf(taskArgs.to)).toNumber();
    const ownerBalance = (
      await ERC20Contract.balanceOf(owner.address)
    ).toNumber();
    console.log(`Balance of ${owner.address} :`, ownerBalance);
    console.log(`Balance of ${taskArgs.to} :`, toBalance);
  });
