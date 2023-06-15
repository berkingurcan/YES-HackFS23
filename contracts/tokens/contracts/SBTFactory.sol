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
    function deploySBT(string memory name, string memory symbol) public returns (address) {
        SBT sbt = new SBT(name, symbol);
        emit SBTDeployed(msg.sender, address(sbt));
        return address(sbt);
    }
}