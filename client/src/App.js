import React, { Component } from "react";
import REBToken from "./contracts/REBToken.json";
import REBCrowdsale from "./contracts/REBCrowdsale.json";
import Kyc from "./contracts/Kyc.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    loaded: false,
    kycAddress: "",
    tokensToBuy: 0,
    tokenBalanceFormatted: null,
    crowdsaleWeiRaised: null,
    tokenCrowdsaleAddress: null,
  };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      this.networkId = await this.web3.eth.net.getId();

      this.initContracts();

      await this.getMyBalance();
      await this.getCrowdsaleWeiRaised();
      this.setState({ loaded: true });
      this.listenToAccountChanges();
      this.listenToTokenTransfer();
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  initContracts = () => {
    this.tokenInstance = new this.web3.eth.Contract(
      REBToken.abi,
      REBToken.networks[this.networkId] && REBToken.networks[this.networkId].address
    );
    this.crowdsaleInstance = new this.web3.eth.Contract(
      REBCrowdsale.abi,
      REBCrowdsale.networks[this.networkId] && REBCrowdsale.networks[this.networkId].address
    );
    this.kycInstance = new this.web3.eth.Contract(
      Kyc.abi,
      Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address
    );
    this.setState({ tokenCrowdsaleAddress: REBCrowdsale.networks[this.networkId].address });
  };

  listenToAccountChanges = () => {
    window.ethereum.on("accountsChanged", async (accounts) => {
      this.accounts = accounts;
      await this.getMyBalance();
    });
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer().on("data", this.getMyBalance);
  };

  getMyBalance = async () => {
    const tokenBalance = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    const tokenBalanceFormatted = this.web3.utils.fromWei(tokenBalance, "ether");
    this.setState({ tokenBalanceFormatted: tokenBalanceFormatted });
  };

  getCrowdsaleWeiRaised = async () => {
    const crowdsaleWeiRaised = await this.crowdsaleInstance.methods.weiRaised().call();
    this.setState({ crowdsaleWeiRaised: crowdsaleWeiRaised });
  };

  handleKycAddressInputChange = (event) => {
    this.setState({ kycAddress: event.target.value });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({ from: this.accounts[0] });
    alert("Account added to whitelist: " + this.state.kycAddress);
  };

  handleTokensToBuyInputChange = (event) => {
    this.setState({ tokensToBuy: event.target.value });
  };

  handleBuyTokens = async () => {
    await this.crowdsaleInstance.methods
      .buyTokens(this.accounts[0])
      .send({ from: this.accounts[0], value: this.state.tokensToBuy });
    alert(`Succefully bought ${this.state.tokensToBuy} rebel tokens`);
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }
    return (
      <div className="App">
        <h1>Rebel Token!</h1>
        Address to allow:
        <input
          type="text"
          name="kycAddress"
          value={this.state.kycAddress}
          onChange={this.handleKycAddressInputChange}
        />
        <button type="button" onClick={this.handleKycWhitelisting}>
          Add to whitelist
        </button>
        <p>Total Wei raised by crowdsale: {this.state.crowdsaleWeiRaised}</p>
        <p>Your token balance: {this.state.tokenBalanceFormatted} REB</p>
        <input
          type="number"
          name="tokensToBuy"
          value={this.state.tokensToBuy}
          onChange={this.handleTokensToBuyInputChange}
        />
        <button type="button" onClick={this.handleBuyTokens}>
          Buy Tokens
        </button>
      </div>
    );
  }
}

export default App;
