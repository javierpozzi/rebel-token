require("dotenv").config({path: "./.env"});
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const accountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      host: "127.0.0.1",
      network_id: "5777",
    },
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545/", accountIndex);
      },
      network_id: "5777",
    },
    rinkeby_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.RINKEBY_INFURA_ENDPOINT, accountIndex);
      },
      network_id: "4",
    },
    goerli_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.GOERLI_INFURA_ENDPOINT, accountIndex);
      },
      network_id: "5",
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.ROPSTEN_INFURA_ENDPOINT, accountIndex);
      },
      network_id: "3",
    },
  },
  compilers: {
    solc: {
      version: "^0.6.0",
    },
  },
};
