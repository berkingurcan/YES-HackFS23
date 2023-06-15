// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract SBT is ERC721, ERC721URIStorage, Ownable {

    /**
     * @dev Metadata struct
     * @param cid IPFS content identifier
     * @param encryptedSymmetricKey encrypted symmetric key of the file
     */
    struct Metadata {
        string cid;
        string encryptedSymmetricKey;
    }

    // Mapping from token ID to metadata
    mapping(uint256 => Metadata) private _metadata;
    
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable() {}

    /**
     * @dev Mint a new token
     * @param to address of the new token owner
     * @param tokenId token ID
     * @param cid IPFS content identifier
     * @param encryptedSymmetricKey encrypted symmetric key of the file
     */ 
    function mint(address to, uint256 tokenId, string memory cid, string memory encryptedSymmetricKey) public onlyOwner {
        _mint(to, tokenId);
        _metadata[tokenId] = Metadata(cid, encryptedSymmetricKey);
    }

    /**
     * @dev Get metadata of a token
     * @param tokenId token ID
     * @return metadata of the token
     */
    function getMetadata(uint256 tokenId) public view returns (Metadata memory) {
        return _metadata[tokenId];
    }

    function _baseURI() internal pure override returns (string memory) {
        return "";
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
