const REBTokenArtifact = artifacts.require("REBToken");

const chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

contract("REBToken", async function (accounts) {
  const [deployerAccount, recipient] = accounts;
  const tokenTotalSupply = new BN(1000000);

  let rebToken;

  beforeEach(async function () {
    rebToken = await REBTokenArtifact.deployed();
  });

  it("should have the correct initial values", async function () {
    const name = await rebToken.name();
    const symbol = await rebToken.symbol();
    const decimals = await rebToken.decimals();
    const totalSupply = await rebToken.totalSupply();

    expect(name).to.equal("Rebel Token");
    expect(symbol).to.equal("REB");
    expect(decimals).to.be.bignumber.equal(new BN(18));
    expect(totalSupply).to.be.bignumber.equal(tokenTotalSupply);
  });

  it("should have all initial tokens in deployer account", async function () {
    const balance = await rebToken.balanceOf(deployerAccount);
    const totalSupply = await rebToken.totalSupply();
    expect(balance).to.be.bignumber.equal(totalSupply);
  });

  it("should transfer between accounts", async function () {
    const amount = new BN(100);
    const expectedSenderBalanceAfterTransfer = tokenTotalSupply.sub(amount);
    const expectedRecipientBalanceAfterTransfer = amount;

    const senderBalanceBeforeTransfer = await rebToken.balanceOf(deployerAccount);
    const receiverBalanceBeforeTransfer = await rebToken.balanceOf(recipient);

    await rebToken.transfer(recipient, amount);

    const senderBalanceAfterTransfer = await rebToken.balanceOf(deployerAccount);
    const receiverBalanceAfterTransfer = await rebToken.balanceOf(recipient);

    expect(senderBalanceBeforeTransfer).to.be.bignumber.equal(senderBalanceAfterTransfer.add(amount));
    expect(receiverBalanceBeforeTransfer).to.be.bignumber.equal(new BN(0));
    expect(senderBalanceAfterTransfer).to.be.bignumber.equal(expectedSenderBalanceAfterTransfer);
    expect(receiverBalanceAfterTransfer).to.be.bignumber.equal(expectedRecipientBalanceAfterTransfer);
  });

  it("should not transfer more tokens than available in account", async function () {
    const balance = await rebToken.balanceOf(deployerAccount);
    const amount = balance.add(new BN(1));

    expect(rebToken.transfer(recipient, amount)).to.eventually.be.false;
  });

});
