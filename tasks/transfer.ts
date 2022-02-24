import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ERC_ADDRESS } from "../config";

task("transfer")
  .addParam("to", "Address which tokens will be sended")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    // TODO: Тут должен быть всегда первый контракт из тестовой сети?
    // Ведь функцию transfer нужно выполнять адреса, который в консоли
    const owner : Signer = (await hre.ethers.getSigners())[0];
    const ERC20Contract = await hre.ethers.getContractAt("ERC20", ERC_ADDRESS);
    const ERC20WithSigner = ERC20Contract.connect(owner);

    await ERC20WithSigner.transfer(taskArgs.to, taskArgs.amount);
    const toBalance = (await ERC20Contract.balanceOf(taskArgs.to)).toNumber();
    console.log(`Balance of ${taskArgs.to} :`, toBalance);    
  });
