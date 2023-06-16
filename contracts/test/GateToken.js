const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GateToken", function () {
  let GateToken;
  let gateToken;
  let owner;
  let recipient;

  async function deployGateToken() {
    GateToken = await ethers.getContractFactory("GateToken");
    [owner, recipient] = await ethers.getSigners();

    gateToken = await GateToken.deploy(owner.address, "Gate Token", "GT");
    await gateToken.deployed();
    console.log("GateToken deployed to:", gateToken.address)
  }

  describe("Deployment", function () {
    it("should deploy GateToken", async function () {
      await deployGateToken();
    });
  });

  it("should mint tokens to recipient", async function () {
    await gateToken.mint(recipient.address);
    const balance = await gateToken.balanceOf(recipient.address);

    expect(balance).to.equal(ethers.BigNumber.from("1000000000000000000"));
  });

  it("should burn tokens from owner", async function () {
    await gateToken.mint(owner.address);
    const initialBalance = await gateToken.balanceOf(owner.address);

    await gateToken.burnFromVerifier(owner.address);
    const finalBalance = await gateToken.balanceOf(owner.address);

    expect(finalBalance).to.equal(initialBalance.sub(ethers.BigNumber.from("1000000000000000000")));
  });

  it("should revert transfer", async function () {
    await expect(gateToken.transfer(recipient.address, ethers.BigNumber.from("1000000000000000000"))).to.be.revertedWith("No transfer");
  });

  it("should revert transferFrom", async function () {
    await expect(gateToken.transferFrom(owner.address, recipient.address, ethers.BigNumber.from("1000000000000000000"))).to.be.revertedWith("No transfer");
  });
});
