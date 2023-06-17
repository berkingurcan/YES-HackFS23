// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GateToken is ERC20, ERC20Burnable, Ownable {
    constructor(
        address _owner,
        string memory _gateName,
        string memory _gateSymbol
    ) ERC20(_gateName, _gateSymbol) {
        transferOwnership(_owner);
    }

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

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        revert("No transfer");
    }

    function burnFromVerifier(address account) public onlyOwner {
        _burn(account, 1 * 10 ** 18);
    }
}
