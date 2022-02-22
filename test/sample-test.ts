import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("ERC20", function () {
  let ERC20: Contract;
  beforeEach(async () => {
    const ERC20Factory = await ethers.getContractFactory("ERC20");
    ERC20 = await ERC20Factory.deploy();
    await ERC20.deployed();
  });

  describe("Mint tokens", () => {
    it("Should mint tokens", async () => {
      const [owner] = await ethers.getSigners();
      ERC20.mint(owner.address, 1000);
      ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(2000);
      expect(await ERC20.totalSupply()).to.equal(2000);
    });

    it("Should fail if owner has 0 address", async () => {
      await expect(
        ERC20.mint(ethers.constants.AddressZero, 1000)
      ).to.be.revertedWith("Zero address");
    });
  });
});
