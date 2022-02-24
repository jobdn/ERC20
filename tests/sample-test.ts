import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC20__factory, ERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC20", function () {
  let ERC20: ERC20;
  let owner: SignerWithAddress,
    acc1: SignerWithAddress,
    acc2: SignerWithAddress;

  beforeEach(async () => {
    [owner, acc1, acc2] = await ethers.getSigners();
    const ERC20Factory: ERC20__factory = (await ethers.getContractFactory(
      "ERC20"
    )) as ERC20__factory;
    ERC20 = await ERC20Factory.deploy();
    await ERC20.deployed();
  });

  describe("Mint tokens", () => {
    it("Should mint tokens", async () => {
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

  describe("Transactions with transfer", () => {
    it("Should transfer tokens between accounts", async () => {
      await ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);

      // Send 0 tokens
      await ERC20.transfer(acc1.address, 0);
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);

      // Send 500 tokens
      await ERC20.transfer(acc1.address, 500);
      expect(await ERC20.balanceOf(owner.address)).to.equal(500);
      expect(await ERC20.balanceOf(owner.address)).to.equal(500);
    });

    it("Should fail if transfer doen't have anough tokens", async () => {
      await ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);

      await expect(ERC20.transfer(acc1.address, 2000)).to.be.revertedWith(
        "Not enough tokens"
      );
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);
    });
  });
});
