require("dotenv").config({ path: "../.env" });

const rebelTokenArtifact = artifacts.require("REBToken");
const rebelCrowdsaleArtifact = artifacts.require("REBCrowdsale");
const kycArtifact = artifacts.require("Kyc");

const chai = require("./setupChai.js");
const expect = chai.expect;
const BN = web3.utils.BN;

contract("REBCrowdsale", async function (accounts) {
  const [deployerAccount, whitelistedAccount, notWhitelistedAccount] = accounts;
  const tokenTotalSupply = new BN(process.env.INITIAL_SUPPLY);

  let rebToken;
  let rebCrowdsale;
  let kyc;

  beforeEach(async function () {
    rebToken = await rebelTokenArtifact.new(tokenTotalSupply);
    kyc = await kycArtifact.new();
    rebCrowdsale = await rebelCrowdsaleArtifact.new(
      process.env.CROWDSALE_RATE,
      deployerAccount,
      rebToken.address,
      kyc.address
    );

    await rebToken.transfer(rebCrowdsale.address, tokenTotalSupply);
    await kyc.setKycCompleted(whitelistedAccount, { from: deployerAccount });
  });

  it("should not have any tokens in deployer account", async function () {
    const balance = await rebToken.balanceOf(deployerAccount);
    expect(balance).to.be.bignumber.equal(new BN(0));
  });

  it("should have all tokens in the crownsale contract by default", async function () {
    const balance = await rebToken.balanceOf(rebCrowdsale.address);
    expect(balance).to.be.bignumber.equal(tokenTotalSupply);
  });

  it("should be able to buy tokens from whitelisted account", async function () {
    const amount = new BN(1);
    const rate = await rebCrowdsale.rate();
    const balanceBeforeTransaction = await rebToken.balanceOf(whitelistedAccount);

    await rebCrowdsale.sendTransaction({ from: whitelistedAccount, value: web3.utils.toWei(amount.toString(), "wei") });

    const balanceAfterTransaction = await rebToken.balanceOf(whitelistedAccount);

    expect(balanceAfterTransaction).to.be.bignumber.equal(balanceBeforeTransaction.add(amount.mul(rate)));
  });

  it("should not be able to buy tokens from a not whitelisted account", async function () {
    await expect(rebCrowdsale.sendTransaction({ from: notWhitelistedAccount, value: 1 })).to.eventually.be.rejectedWith(
      "Beneficiary must have completed KYC"
    );
  });
});
