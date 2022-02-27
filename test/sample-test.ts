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
    ERC20 = await ERC20Factory.deploy("ERC20 Token", "ERC20T", 100);
    await ERC20.deployed();
  });

  describe("Mint tokens", () => {
    it("Should mint tokens", async () => {
      ERC20.mint(owner.address, 1000);
      ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(2000);
      expect(await ERC20.totalSupply()).to.equal(2000);
    });

    it("Should fail if not owner", async () => {
      await expect(
        ERC20.connect(acc1).mint(acc1.address, 1000)
      ).to.be.revertedWith("You are not owner");
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

    it("Should fail if owner doesn't have enough tokens", async () => {
      await ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);

      await expect(ERC20.transfer(acc1.address, 2000)).to.be.revertedWith(
        "Not enough tokens"
      );
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);
    });
  });

  describe("Transactions with transferFrom", () => {
    it("Should fail if spender cannot spend tokens of the owner or owner has no tokens", async () => {
      // If owner has no enough tokens
      await expect(
        ERC20.connect(acc1).transferFrom(owner.address, acc1.address, 1000)
      ).to.be.revertedWith("Not enough tokens");

      await ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);

      // If owner has tokens
      await expect(
        ERC20.connect(acc1).transferFrom(owner.address, acc1.address, 1000)
      ).to.be.revertedWith(
        "Cannot transfer such tokens amount or you cannot spend tokens of this owner"
      );
    });

    it("Should update the allowed spenders of owner", async () => {
      await ERC20.mint(owner.address, 5000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(5000);

      // Allow acc1 and acc2 to spend tokens from owner
      await ERC20.approve(acc1.address, 1000);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(1000);

      await ERC20.approve(acc2.address, 1000);
      expect(await ERC20.allowance(owner.address, acc2.address)).to.equal(1000);
    });

    it("Should transfer tokens from owner to acc1 and acc2", async () => {
      await ERC20.mint(owner.address, 5000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(5000);

      // Allow acc1 and acc2 to spend tokens from owner
      await ERC20.approve(acc1.address, 1000);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(1000);
      await ERC20.approve(acc2.address, 1000);
      expect(await ERC20.allowance(owner.address, acc2.address)).to.equal(1000);

      await ERC20.connect(acc1).transferFrom(owner.address, acc1.address, 500);
      expect(await ERC20.balanceOf(acc1.address)).to.equal(500);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(500);
      expect(await ERC20.balanceOf(owner.address)).to.equal(4500);

      await ERC20.connect(acc2).transferFrom(owner.address, acc2.address, 300);
      expect(await ERC20.balanceOf(acc2.address)).to.equal(300);
      expect(await ERC20.allowance(owner.address, acc2.address)).to.equal(700);
      expect(await ERC20.balanceOf(owner.address)).to.equal(4200);
    });
  });

  describe("Burn tests", () => {
    it("Should fail if there is no such amount of tokens", async () => {
      await expect(ERC20.burn(owner.address, 1000)).to.be.revertedWith(
        "There is no such amount of tokens"
      );
    });

    it("Should fail if not owner", async () => {
      await expect(
        ERC20.connect(acc1).burn(acc1.address, 1000)
      ).to.be.revertedWith("You are not owner");
    });

    it("Should burn some amount of tokens", async () => {
      await ERC20.mint(owner.address, 1000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(1000);

      await ERC20.burn(owner.address, 500);
      expect(await ERC20.balanceOf(owner.address)).to.equal(500);

      await ERC20.burn(owner.address, 500);
      expect(await ERC20.balanceOf(owner.address)).to.equal(0);
    });
  });

  describe("Increase and decrease tests", () => {
    it("Should increase allowance", async () => {
      await ERC20.mint(owner.address, 5000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(5000);

      await ERC20.approve(acc1.address, 700);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(700);

      await ERC20.increaseAllowance(acc1.address, 300);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(1000);
    });

    it("Should decrease allowance", async () => {
      await ERC20.mint(owner.address, 5000);
      expect(await ERC20.balanceOf(owner.address)).to.equal(5000);

      await ERC20.approve(acc1.address, 700);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(700);

      await ERC20.decreaseAllowance(acc1.address, 300);
      expect(await ERC20.allowance(owner.address, acc1.address)).to.equal(400);
    });

    it("Should fail if allowance will be less than 0", async () => {
      await expect(
        ERC20.decreaseAllowance(acc1.address, 500)
      ).to.be.revertedWith("Allowed value to spend less then 0");
    });
  });
});
