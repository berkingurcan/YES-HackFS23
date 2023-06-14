// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBT is ERC721, ERC721URIStorage, Ownable {
    constructor() ERC721("SBT", "SBT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://";
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function transferFrom(address, address, uint256) public virtual override {
        revert("Token transfer is not allowed");
    }

    function safeTransferFrom(address, address, uint256) public virtual override {
        revert("Token transfer is not allowed");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public virtual override {
        revert("Token transfer is not allowed");
    }

    function _safeTransfer(address, address, uint256, bytes memory) internal virtual override {
        revert("Token transfer is not allowed");
    }
}