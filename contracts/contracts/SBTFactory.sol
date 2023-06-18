// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SBT.sol";

contract SBTFactory {
    event SBTDeployed(address indexed owner, address indexed sbt);

    /**
     * @dev Deploy a new SBT contract
     * @param name name of the SBT contract
     * @param symbol symbol of the SBT contract
     * @return address of the new SBT contract
     */
    function deploySBT(string memory name, string memory symbol, address to_, uint256 tokenId_, string memory cid_, string memory encryptedSymmetricKey_) public returns (address) {
        SBT sbt = new SBT(name, symbol, to_, tokenId_, cid_, encryptedSymmetricKey_);
        emit SBTDeployed(msg.sender, address(sbt));
        return address(sbt);
    }
}