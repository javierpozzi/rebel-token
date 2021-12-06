require("dotenv").config({ path: "../.env" });

const REBTokenArtifact = artifacts.require("./REBToken.sol");
const REBCrowdsaleArtifact = artifacts.require("./REBCrowdsale.sol");
const kycArtifact  = artifacts.require("./Kyc.sol");

module.exports = async function(deployer) {
  let accounts = await web3.eth.getAccounts();
  await deployer.deploy(REBTokenArtifact, process.env.INITIAL_SUPPLY);
  await deployer.deploy(kycArtifact);
  await deployer.deploy(REBCrowdsaleArtifact, process.env.CROWDSALE_RATE, accounts[0], REBTokenArtifact.address, kycArtifact.address);
  let rebToken = await REBTokenArtifact.deployed();
  let rebCrowdsale = await REBCrowdsaleArtifact.deployed();
  await kycArtifact.deployed();
  await rebToken.transfer(rebCrowdsale.address, process.env.INITIAL_SUPPLY);
}