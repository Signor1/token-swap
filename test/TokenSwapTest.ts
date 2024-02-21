import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token Swap Testing", function () {
  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    //usd token
    const usDollarContract = await ethers.getContractFactory("USDollar");

    const usdToken = await usDollarContract.deploy(owner);
    //naira token
    const nairaContract = await ethers.getContractFactory("NairaToken");

    const nairaToken = await nairaContract.deploy(owner);

    // token swap
    const swapContract = await ethers.getContractFactory("TokenSwap");

    const tokenSwap = await swapContract.deploy(
      usdToken.target,
      nairaToken.target
    );

    return {
      usdToken,
      nairaToken,
      tokenSwap,
      owner,
      otherAccount,
    };
  }

  describe("Deployment Check", function () {
    it("Should check if the usd token was deployed", async function () {
      const { usdToken } = await loadFixture(deployContracts);
      expect(usdToken).to.exist;
    });
    it("Should check if the naira token was deployed", async function () {
      const { nairaToken } = await loadFixture(deployContracts);
      expect(nairaToken).to.exist;
    });
    it("Should check if the token swap contract was deployed", async function () {
      const { tokenSwap } = await loadFixture(deployContracts);
      expect(tokenSwap).to.exist;
    });
  });

  describe("USD token to Naira token Swap Check", function () {
    it("Should check that the swapper is address 0", async function () {
      const { owner } = await loadFixture(deployContracts);

      const sender = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(sender).is.not.equal(nullAddress);
    });
    it("Should check for zero amount", async function () {
      const { tokenSwap } = await loadFixture(deployContracts);

      await expect(tokenSwap.swapFromUSDToNaira(0)).to.be.revertedWith(
        "Zero amount not allowed"
      );
    });

    it("Should check if the allowed amount is greater than or equals amount entered", async function () {
      const { tokenSwap } = await loadFixture(deployContracts);

      await expect(tokenSwap.swapFromUSDToNaira(100)).to.be.revertedWith(
        "Token allowance is too low"
      );
    });

    it("Should allow user swap after approval", async function () {
      const { usdToken, nairaToken, tokenSwap, owner, otherAccount } =
        await loadFixture(deployContracts);

      const amtToTransfer = 90000000000;

      const transfer1 = await usdToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer1.wait();

      const transfer2 = await nairaToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer2.wait();

      const balOfUSDBeforeSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaBeforeSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(await nairaToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      expect(await usdToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      const spendable = 10000;

      const appr = await usdToken
        .connect(owner)
        .approve(tokenSwap.target, spendable);
      appr.wait();

      const swap = await tokenSwap.connect(owner).swapFromUSDToNaira(1000);
      swap.wait();

      const balOfUSDAfterSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaAfterSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(balOfUSDAfterSwap).to.be.greaterThan(balOfUSDBeforeSwap);
      expect(balOfNairaAfterSwap).to.be.lessThan(balOfNairaBeforeSwap);
    });
  });
  describe("Naira token to USD token Swap Check", function () {
    it("Should check that the swapper is address 0", async function () {
      const { owner } = await loadFixture(deployContracts);

      const sender = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(sender).is.not.equal(nullAddress);
    });
    it("Should check for zero amount", async function () {
      const { tokenSwap } = await loadFixture(deployContracts);

      await expect(tokenSwap.swapFromNairaToUSD(0)).to.be.revertedWith(
        "Zero amount not allowed"
      );
    });

    it("Should check if the allowed amount is greater than or equals amount entered", async function () {
      const { tokenSwap } = await loadFixture(deployContracts);

      await expect(tokenSwap.swapFromNairaToUSD(100)).to.be.revertedWith(
        "Token allowance is too low"
      );
    });

    it("Should allow user swap after approval", async function () {
      const { usdToken, nairaToken, tokenSwap, owner, otherAccount } =
        await loadFixture(deployContracts);

      const amtToTransfer = 90000000000;

      const transfer1 = await usdToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer1.wait();

      const transfer2 = await nairaToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer2.wait();

      const balOfUSDBeforeSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaBeforeSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(await nairaToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      expect(await usdToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      const spendable = 10000;

      const appr = await nairaToken
        .connect(owner)
        .approve(tokenSwap.target, spendable);
      appr.wait();

      const swap = await tokenSwap.connect(owner).swapFromNairaToUSD(1000);
      swap.wait();

      const balOfUSDAfterSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaAfterSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(balOfNairaAfterSwap).to.be.greaterThan(balOfNairaBeforeSwap);
      expect(balOfUSDAfterSwap).to.be.lessThan(balOfUSDBeforeSwap);
    });
  });

  describe("Event Check", function () {
    it("Should emit an event after successful swap from Naira to USD", async function () {
      const { usdToken, nairaToken, tokenSwap, owner } = await loadFixture(
        deployContracts
      );

      const amtToTransfer = 90000000000;

      const transfer1 = await usdToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer1.wait();

      const transfer2 = await nairaToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer2.wait();

      const balOfUSDBeforeSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaBeforeSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(await nairaToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      expect(await usdToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      const spendable = 10000;

      const appr = await nairaToken
        .connect(owner)
        .approve(tokenSwap.target, spendable);
      appr.wait();

      const amoutToSwap = 1000;
      const amountSwapped = 500;

      const swap = await tokenSwap
        .connect(owner)
        .swapFromNairaToUSD(amoutToSwap);
      swap.wait();

      const balOfUSDAfterSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaAfterSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(balOfNairaAfterSwap).to.be.greaterThan(balOfNairaBeforeSwap);
      expect(balOfUSDAfterSwap).to.be.lessThan(balOfUSDBeforeSwap);

      await expect(swap)
        .to.emit(tokenSwap, "TokenSwapped")
        .withArgs(owner, amoutToSwap, amountSwapped, true);
    });
    it("Should emit an event after successful swap from USD to Naira", async function () {
      const { usdToken, nairaToken, tokenSwap, owner } = await loadFixture(
        deployContracts
      );

      const amtToTransfer = 90000000000;

      const transfer1 = await usdToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer1.wait();

      const transfer2 = await nairaToken
        .connect(owner)
        .transfer(tokenSwap.target, amtToTransfer);
      transfer2.wait();

      const balOfUSDBeforeSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaBeforeSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(await nairaToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      expect(await usdToken.balanceOf(tokenSwap.target)).to.be.equal(
        amtToTransfer
      );

      const spendable = 10000;

      const appr = await usdToken
        .connect(owner)
        .approve(tokenSwap.target, spendable);
      appr.wait();

      const amoutToSwap = 1000;
      const amountSwapped = 2000;

      const swap = await tokenSwap.connect(owner).swapFromUSDToNaira(1000);
      swap.wait();

      const balOfUSDAfterSwap = await usdToken.balanceOf(tokenSwap.target);
      const balOfNairaAfterSwap = await nairaToken.balanceOf(tokenSwap.target);

      expect(balOfUSDAfterSwap).to.be.greaterThan(balOfUSDBeforeSwap);
      expect(balOfNairaAfterSwap).to.be.lessThan(balOfNairaBeforeSwap);

      await expect(swap)
        .to.emit(tokenSwap, "TokenSwapped")
        .withArgs(owner, amoutToSwap, amountSwapped, true);
    });
  });
});
