// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GateToken is ERC20, ERC20Burnable, Ownable {
    constructor(
        string memory _gateName,
        string memory _gateSymbol
    ) ERC20(_gateName, _gateSymbol) {}

    function mint(address to) public onlyOwner {
        _mint(to, 1 * 10 ** 18);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        revert("No transfer");
    }
}
