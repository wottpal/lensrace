// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LensraceVictoryNFT is ERC721, AccessControl {
    event VictoryMinted(address indexed to, uint256 indexed tokenId);

    bytes32 public constant FACTORY_ROLE = keccak256("FACTORY_ROLE");
    bytes32 public constant RACE_ROLE = keccak256("RACE_ROLE");

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    string public baseURI;

    constructor(string memory baseURI_) ERC721("Lensrace Victory", "LRV") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        baseURI = baseURI_;
    }

    /// @notice Sets `baseURI` which is used to prefix the `tokenUri`.
    function setBaseURI(string memory baseURI_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = baseURI_;
    }

    /// @notice Grants `FACTORY_ROLE` to `LensraceFactory` contract.
    function grantFactoryRole(address factory) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(FACTORY_ROLE, factory);
    }

    /// @notice Grants `RACE_ROLE` to `Lensrace` contract(s).
    function grantRaceRole(address race) public onlyRole(FACTORY_ROLE) {
        _grantRole(RACE_ROLE, race);
    }

    /// @notice Returns `baseURI` which is used to prefix the `tokenUri`.
    function _baseURI() internal view override(ERC721) returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Mints a victory NFT to the given address. Called by a `Lensrace` contract.
     * @param to Owner address of the winning profile id.
     * @return tokenId Minted token id.
     */
    function safeMint(address to) public onlyRole(RACE_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        emit VictoryMinted(to, tokenId);
        return tokenId;
    }

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 firstTokenId,
    //     uint256 batchSize
    // ) internal override {
    //     require(from == address(0), "token cannot be transferred");
    //     super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    // }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
