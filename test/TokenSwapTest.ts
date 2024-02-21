import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("Token Swap Testing", function () {
  //   initial owners
  const usdInitialOwner = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  const nairaInitialOwner = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";

  async function deployContracts() {
    //usd token
    const usDollarContract = await ethers.getContractFactory("USDollar");

    const usdToken = await usDollarContract.deploy(usdInitialOwner);
    //naira token
    const nairaContract = await ethers.getContractFactory("NairaToken");

    const nairaToken = await nairaContract.deploy(nairaInitialOwner);

    // token swap
    const swapContract = await ethers.getContractFactory("TokenSwap");

    const tokenSwap = await swapContract.deploy(
      usdToken.target,
      nairaToken.target
    );

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    return { usdToken, nairaToken, tokenSwap, owner, otherAccount };
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
    it("Should check for zero amount", async function () {
      const { tokenSwap } = await loadFixture(deployContracts);

      await expect(tokenSwap.swapFromUSDToNaira(0)).to.be.revertedWith(
        "Zero amount not allowed"
      );
    });
  });
});
