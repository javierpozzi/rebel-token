const REBTokenArtifact = artifacts.require("./REBToken.sol");
const REBCrowdsaleArtifact = artifacts.require("./REBCrowdsale.sol");


module.exports = async function(deployer) {
  let accounts = await web3.eth.getAccounts();
  await deployer.deploy(REBTokenArtifact, 1000000);
  await deployer.deploy(REBCrowdsaleArtifact, 1, accounts[0], REBTokenArtifact.address);
  let rebToken = await REBTokenArtifact.deployed();
  let rebCrowdsale = await REBCrowdsaleArtifact.deployed();
  await rebToken.transfer(rebCrowdsale.address, 1000000);
}