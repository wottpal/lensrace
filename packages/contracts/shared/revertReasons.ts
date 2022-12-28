export const RevertReasons = {
  // Initializable
  ContractAlreadyInitialized: /contract is already initialized/i,

  // LensraceFactory
  LensHubAddressEmpty: /lensHub address cannot be zero/i,
  RaceNftAddressEmpty: /raceNft address not yet set/i,
  ProfileIdsEmpty: /profileIds cannot be empty/i,
  NotAllProfileIdsExist: /not all given profileIds exist/i,

  // Lensrace
  RaceGoalNotReached: /goal not reached yet/i,
  RaceCanBeSettledOnInit: /can be settled on init/i,

  // AccessControl
  AccountIsMissingRole: /AccessControl: account (.*) is missing role (.*)/i,

  // LensraceVictoryNFT
  NFTTokenTransferBlocked: /token cannot be transferred/i,
}
