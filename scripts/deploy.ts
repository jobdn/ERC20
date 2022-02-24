import hre from "hardhat";
import { config } from "../config";
import { ERC20, ERC20__factory } from "../typechain-types";

async function deploy() {
  const ERC20Factory: ERC20__factory = (await hre.ethers.getContractFactory(
    "ERC20"
  )) as ERC20__factory;
  const ERC20: ERC20 = await ERC20Factory.deploy(
    config.NAME,
    config.SYMBOL,
    config.DECIMALS
  );
  await ERC20.deployed();
  console.log("ERC20 constract is deployed to: ", ERC20.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
