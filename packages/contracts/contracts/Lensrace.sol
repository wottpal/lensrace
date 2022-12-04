// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {LensraceFactory} from "./LensraceFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract Lensrace {
    event RaceSettled(uint256 indexed winnerProfileId, uint256 indexed winnerFollowerCount);

    LensraceFactory public factory;

    uint256[] public profileIds;
    string public raceName;
    uint256 public followerGoal;

    bool public hasSettled = false;
    uint256 public winnerProfileId;

    /**
     * @notice Initializes the contract parameters. Can be only called once and
     *   can't be done in a conventional constructor due to the cloning mechanism.
     * @param _factory Address of the parent LensraceFactory contract
     * @param _profileIds Array of Lens profile ids in the LensHub
     * @param _raceName Custom string that resembles the race
     * @param _followerGoal Absolute follower goal the winner should reach
     */
    function init(
        address _factory,
        uint256[] memory _profileIds,
        string memory _raceName,
        uint256 _followerGoal
    ) external {
        require(address(factory) == address(0), "already initialized");

        factory = LensraceFactory(_factory);
        profileIds = _profileIds;
        raceName = _raceName;
        followerGoal = _followerGoal;
    }

    /**
     * @notice Returns the full profileIds array
     */
    function getProfileIds() public view returns (uint256[] memory) {
        return profileIds;
    }

    /**
     * @notice Settles the race if the winning condition has reached by one participating
     *   `profileIds`. Reverts if no one has reached the `followerGoal` yet.
     */
    function settle() public returns (uint256) {
        // Determine max follower count and associated profile id
        uint256 maxFollowerCount;
        uint256 maxProfileId;
        for (uint256 i = 0; i < profileIds.length; i++) {
            address followNft = factory.lensHub().getFollowNFT(profileIds[i]);
            uint256 followerCount = IERC721Enumerable(followNft).totalSupply();
            if (followerCount > maxFollowerCount) {
                maxFollowerCount = followerCount;
                maxProfileId = profileIds[i];
            }
        }

        require(maxFollowerCount >= followerGoal, "goal not reached yet");

        // Settle race and store winner
        hasSettled = true;
        winnerProfileId = maxProfileId;
        emit RaceSettled(winnerProfileId, maxFollowerCount);

        return winnerProfileId;
    }
}
