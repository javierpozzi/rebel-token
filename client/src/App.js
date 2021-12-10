import React, { Component } from "react";
import REBToken from "./contracts/REBToken.json";
import REBCrowdsale from "./contracts/REBCrowdsale.json";
import Kyc from "./contracts/Kyc.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "", tokensQuantity: 0, tokenBalance: 0, crowdsaleWeiRaised: 0, tokenDecimals: 0, tokenCrowdsaleAddress: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
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

      this.listenToTokenTransfer();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true, tokenCrowdsaleAddress: REBCrowdsale.networks[this.networkId].address });
      await this.getTokenDecimals();
      await this.getMyBalance();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  getMyBalance = async () => {
    const tokenBalance = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({ tokenBalance: tokenBalance });
  };

  getTokenDecimals = async () => {
    const tokenDecimals = await this.tokenInstance.methods.decimals().call();
    this.setState({ tokenDecimals: tokenDecimals });
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

  handleTokensQuantityInputChange = (event) => {
    this.setState({ tokensQuantity: event.target.value });
  };

  handleBuyTokens = async () => {
    await this.crowdsaleInstance.methods
      .buyTokens(this.accounts[0])
      .send({ from: this.accounts[0], value: this.state.tokensQuantity });
    alert(`Succefully bought ${this.state.tokensQuantity} tokens`);
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer().on("data", this.getMyBalance);
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
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
        <br />
        <br />
        <p>Total Wei raised by crowdsale: {this.state.crowdsaleWeiRaised}</p>
        <p>Your token balance: {this.state.tokenBalance} REB</p>
        <input
          type="number"
          name="tokensQuantity"
          value={this.state.tokensQuantity}
          onChange={this.handleTokensQuantityInputChange}
        />
        <button type="button" onClick={this.handleBuyTokens}>
          Buy Tokens
        </button>
        <h2>Buy Tokens</h2>
        <p>If you want to buy tokens, you need to send some ETH to the contract: {this.state.tokenCrowdsaleAddress}</p>
      </div>
    );
  }
}

export default App;
