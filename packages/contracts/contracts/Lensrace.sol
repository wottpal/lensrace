// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {LensraceFactory} from "./LensraceFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Lensrace is Initializable {
    event RaceSettled(
        uint256 indexed winnerProfileId,
        uint256 winnerFollowerCount,
        address indexed winningProfileOwner,
        uint256 indexed victoryNftTokenId
    );

    LensraceFactory public factory;

    uint256[] public profileIds;
    string public raceName;
    uint256 public followerGoal;

    bool public hasSettled;
    uint256 public winningProfileId;
    uint256 public winningFollowerCount;

    /**
     * @notice Initializes the contract parameters. Can be only called once and
     *   can't be done in a conventional constructor due to the cloning mechanism.
     * @param _factory Address of the parent LensraceFactory contract.
     * @param _profileIds Array of Lens profile ids in the LensHub.
     * @param _raceName Custom string that resembles the race.
     * @param _followerGoal Absolute follower goal the winner should reach.
     */
    function init(
        address _factory,
        uint256[] memory _profileIds,
        string memory _raceName,
        uint256 _followerGoal
    ) external initializer {
        hasSettled = false;
        factory = LensraceFactory(_factory);
        profileIds = _profileIds;
        raceName = _raceName;
        followerGoal = _followerGoal;

        // Check and revert if winning condition is already fullfilled
        uint256 _winningProfileId;
        (_winningProfileId, ) = canSettle();
        require(_winningProfileId == 0, "can be settled on init");
    }

    /**
     * @notice Returns the full profileIds array
     */
    function getProfileIds() public view returns (uint256[] memory) {
        return profileIds;
    }

    /**
     * @notice Checks if the winning condition has reached by a participating profile.
     * @return `profileId` and `followerCount` of the winning account (zero if none).
     */
    function canSettle() public view returns (uint256, uint256) {
        uint256 maxProfileId;
        uint256 maxFollowerCount;
        for (uint256 i = 0; i < profileIds.length; i++) {
            address followNft = factory.lensHub().getFollowNFT(profileIds[i]);
            if (followNft == address(0)) continue;
            uint256 followerCount = IERC721Enumerable(followNft).totalSupply();
            if (followerCount > maxFollowerCount) {
                maxProfileId = profileIds[i];
                maxFollowerCount = followerCount;
            }
        }
        if (maxFollowerCount < followerGoal) {
            return (0, 0);
        }
        return (maxProfileId, maxFollowerCount);
    }

    /**
     * @notice Settles the race if the winning condition has reached by a participating profile.
     *   Reverts if no one has reached the `followerGoal` yet.
     */
    function settle() public returns (uint256) {
        uint256 _winningProfileId;
        uint256 _winningFollowerCount;
        (_winningProfileId, _winningFollowerCount) = canSettle();
        require(_winningProfileId != 0, "goal not reached yet");

        // Settle race and store winner
        hasSettled = true;
        winningProfileId = _winningProfileId;
        winningFollowerCount = _winningFollowerCount;

        // Mint victory NFT for winner
        address lensHubAddress = address(factory.lensHub());
        address winningProfileOwner = IERC721Enumerable(lensHubAddress).ownerOf(winningProfileId);
        uint256 victoryNftTokenId = factory.raceNft().safeMint(winningProfileOwner);

        emit RaceSettled(
            winningProfileId,
            winningFollowerCount,
            winningProfileOwner,
            victoryNftTokenId
        );
        return winningProfileId;
    }
}
