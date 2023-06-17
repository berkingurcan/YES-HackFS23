// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./GateToken.sol";

contract GateFactory {
    event GateDeployed(address indexed owner, address indexed sbt);

    /**
     * @dev Deploy a new Gate contract
     * @param name name of the Gate contract
     * @param symbol symbol of the Gate contract
     * @return address of the new Gate contract
     */
    function deployGate(address owner, string memory name, string memory symbol) public returns (address) {
        GateToken gate = new GateToken(owner, name, symbol);
        emit GateDeployed(msg.sender, address(gate));
        return address(gate);
    }
}