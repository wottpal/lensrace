// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {LensraceFactory} from "./LensraceFactory.sol";

contract Lensrace {
    event RaceSettled(address indexed winnerProfileId);

    LensraceFactory public factory;

    uint256[] public profileIds;
    string public raceName;
    uint256 public followerGoal;

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
}
