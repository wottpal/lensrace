export const RevertReasons = {
  // Initializable
  ContractAlreadyInitialized: /contract is already initialized/i,

  // LensraceFactory
  NotAllProfileIdsExist: /not all given profile-ids exist/i,

  // Lensrace
  RaceGoalNotReached: /goal not reached yet/i,
  RaceCanBeSettledOnInit: /can be settled on init/i,
}
