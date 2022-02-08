// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 r = a + b;
        require(r >= a, "SafeMath: addition overflow");
        return r;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 r = a - b;
        require(b >= a, "SafeMath: subtraction overflow");
        return r;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 r = a * b;
        require(r / a == b, "SafeMath: multiplication overflow");
        return r;
    }

    function divide(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 r = a / b;
        require(b > 0, "SafeMath: division by zero");
        return r;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}
