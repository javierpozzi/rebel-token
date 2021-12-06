require("dotenv").config({ path: "../.env" });

const REBTokenArtifact = artifacts.require("./REBToken.sol");
const REBCrowdsaleArtifact = artifacts.require("./REBCrowdsale.sol");

module.exports = async function(deployer) {
  let accounts = await web3.eth.getAccounts();
  await deployer.deploy(REBTokenArtifact, process.env.INITIAL_SUPPLY);
  await deployer.deploy(REBCrowdsaleArtifact, 1, accounts[0], REBTokenArtifact.address);
  let rebToken = await REBTokenArtifact.deployed();
  let rebCrowdsale = await REBCrowdsaleArtifact.deployed();
  await rebToken.transfer(rebCrowdsale.address, process.env.INITIAL_SUPPLY);
}