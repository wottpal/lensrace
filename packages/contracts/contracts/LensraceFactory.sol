// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {Lensrace} from "./Lensrace.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@aave/lens-protocol/contracts/interfaces/ILensHub.sol";

contract LensraceFactory {
    event RaceDeployed(address indexed race);

    ILensHub public immutable lensHub;
    address private immutable raceLib;
    Lensrace[] public races;

    constructor(address _lensHub) {
        lensHub = ILensHub(_lensHub);

        // Create empty sample race to clone from
        Lensrace race = new Lensrace();
        uint256[] memory arr;
        race.init(address(this), arr, "", 0);
        raceLib = address(race);
    }

    /**
     * @notice Deploys a new Lensrace contract instance by shallow cloning.
     * @param profileIds Array of Lens profile ids in the LensHub
     * @param raceName Custom string that resembles the race
     * @param followerGoal Absolute follower goal the winner should reach
     */
    function deployRace(
        uint256[] memory profileIds,
        string memory raceName,
        uint256 followerGoal
    ) external returns (address) {
        require(profileIdsExist(profileIds), "not all given profile-ids exist");

        // Clone & init Lensrace
        Lensrace race = Lensrace(Clones.clone(raceLib));
        race.init(address(this), profileIds, raceName, followerGoal);
        races.push(race);

        emit RaceDeployed(address(race));
        return address(race);
    }

    /**
     * @notice Returns `true` if given `profileIds` all exist.
     */
    function profileIdsExist(uint256[] memory profileIds) internal view returns (bool) {
        for (uint256 i = 0; i < profileIds.length; i++) {
            address followNft = lensHub.getFollowNFT(profileIds[i]);
            if (followNft == address(0)) return false;
        }
        return true;
    }

    /**
     * @notice Returns the full races array.
     */
    function getRaces() public view returns (Lensrace[] memory) {
        return races;
    }

    /**
     * @notice Returns the amount of previously deployed races.
     */
    function racesLength() external view returns (uint) {
        return races.length;
    }
}
