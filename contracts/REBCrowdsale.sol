// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Crowdsale.sol";
import "./Kyc.sol";

contract REBCrowdsale is Crowdsale {
    Kyc kyc;

    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token,
        Kyc _kyc
    ) public Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(beneficiary), "Beneficiary must have completed KYC");
    }

}
