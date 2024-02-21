// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";

contract TokenSwap {
    IERC20 public usdToken;
    IERC20 public nairaToken;

    address public owner;

    uint public constant EXCHANGE_RATE = 2;

    event TokenSwapped(
        address user,
        uint amount,
        uint amountOut,
        bool isSwapFromaTob
    );

    constructor(address _usdToken, address _nairaToken) {
        usdToken = IERC20(_usdToken);
        nairaToken = IERC20(_nairaToken);
        owner = msg.sender;
    }

    function swapFromUSDToNaira(uint amountInUSD) external {
        uint amountOutNaira = (amountInUSD * EXCHANGE_RATE);

        usdToken.transferFrom(msg.sender, address(this), amountInUSD);
        nairaToken.transfer(msg.sender, amountOutNaira);

        emit TokenSwapped(msg.sender, amountInUSD, amountOutNaira, true);
    }

    function swapFromNairaToUSD(uint amountInNaira) external {
        uint amountOutUSD = (amountInNaira / EXCHANGE_RATE);

        nairaToken.transferFrom(msg.sender, address(this), amountInNaira);
        usdToken.transfer(msg.sender, amountOutUSD);

        emit TokenSwapped(msg.sender, amountInNaira, amountOutUSD, false);
    }
}
