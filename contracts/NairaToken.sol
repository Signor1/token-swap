// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NairaToken is ERC20, Ownable {
    constructor(
        address initialOwner
    ) ERC20("NairaToken", "NGN") Ownable(initialOwner) {
        _mint(msg.sender, 1000000000000000000000000000000);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
