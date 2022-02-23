import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("transfer")
  .addParam("to", "Address which tokens will be sended")
  .addParam("amount", "Amount of tokens")
  .setAction(async (taskArgs: TaskArguments, hre) => {
      
  })