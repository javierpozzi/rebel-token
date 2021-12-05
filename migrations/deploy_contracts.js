var REBToken = artifacts.require("./REBToken.sol");

module.exports = async function(deployer) {
  await deployer.deploy(REBToken, 1000000);
}