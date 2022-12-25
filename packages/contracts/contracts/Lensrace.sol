// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {LensraceFactory} from "./LensraceFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Lensrace is Initializable {
    event RaceSettled(
        uint256 indexed raceId,
        uint256 indexed winnerProfileId,
        uint256 winnerFollowerCount,
        address indexed winningProfileOwner
    );

    LensraceFactory public factory;

    uint256 public raceId;
    string public raceName;
    uint256[] public profileIds;

    enum RaceType {
        ABSOLUTE,
        RELATIVE
    }
    RaceType public raceType;
    uint256 public followerGoal;

    bool public hasSettled;
    uint256 public winningProfileId;
    uint256 public winningFollowerCount;
    uint256[] public initialFollowerCounts;

    /**
     * @notice Initializes contract parameters. Can be only called once by the owner.
     * @param _factory Address of the parent LensraceFactory contract.
     * @param _raceId Global id of race.
     * @param _raceName Custom string that resembles the race.
     * @param _profileIds Array of Lens profile ids in the LensHub.
     * @param _raceType Defines the type of the race (either absolute or relative).
     * @param _followerGoal Absolute follower goal the winner should reach.
     */
    function initialize(
        address _factory,
        uint256 _raceId,
        string memory _raceName,
        uint256[] memory _profileIds,
        RaceType _raceType,
        uint256 _followerGoal
    ) external initializer {
        hasSettled = false;

        factory = LensraceFactory(_factory);
        raceId = _raceId;
        raceName = _raceName;
        profileIds = _profileIds;
        raceType = _raceType;
        followerGoal = _followerGoal;

        // Store initial follower counts
        initialFollowerCounts = getFollowerCounts();

        // Check and revert if winning condition is already fullfilled
        uint256 _winningProfileId;
        (_winningProfileId, ) = canSettle();
        require(_winningProfileId == 0, "can be settled on init");

        // TODO Add RaceStarted Event
    }

    /**
     * @notice Returns the full profileIds array
     */
    function getProfileIds() public view returns (uint256[] memory) {
        return profileIds;
    }

    /**
     * @notice Returns array of lens follower counts of respective `profileIds`
     */
    function getFollowerCounts() public view returns (uint256[] memory) {
        uint256[] memory followerCounts = new uint256[](profileIds.length);
        for (uint256 i = 0; i < profileIds.length; i++) {
            address followNft = factory.lensHub().getFollowNFT(profileIds[i]);
            followerCounts[i] = followNft == address(0)
                ? 0
                : IERC721Enumerable(followNft).totalSupply();
        }
        return followerCounts;
    }

    /**
     * @notice Checks if the winning condition has reached by a participating profile.
     * @return `profileId` and `followerCount` of the winning account (zero if none).
     */
    function canSettle() public view returns (uint256, uint256) {
        uint256 maxProfileId;
        uint256 maxFollowerCount;
        uint256[] memory followerCounts = getFollowerCounts();
        for (uint256 i = 0; i < profileIds.length; i++) {
            uint256 followerCount = raceType == RaceType.ABSOLUTE
                ? followerCounts[i]
                : followerCounts[i] - initialFollowerCounts[i];
            if (followerCount > maxFollowerCount) {
                maxProfileId = profileIds[i];
                maxFollowerCount = followerCounts[i];
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
        factory.raceNft().safeMint(winningProfileOwner, raceId);

        emit RaceSettled(raceId, winningProfileId, winningFollowerCount, winningProfileOwner);
        return winningProfileId;
    }
}
