import hre from "hardhat";

async function deploy() {
  const ERC20Factory = await hre.ethers.getContractFactory("ERC20");
  const ERC20 = await ERC20Factory.deploy();
  await ERC20.deployed();

  process.env.ERC20_ADDRESS = ERC20.address;
  console.log("ERC20 constract is deployed to: ", ERC20.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
