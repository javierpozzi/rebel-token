// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract REBToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Rebel Token", "REB") public {
        _mint(msg.sender, initialSupply);
    }
}