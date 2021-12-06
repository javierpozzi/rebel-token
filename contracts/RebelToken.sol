// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract REBToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Rebel Token", "REB") {
        _mint(msg.sender, initialSupply);
    }
}