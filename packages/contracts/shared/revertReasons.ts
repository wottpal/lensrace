export const enum RevertReasons {
  // LensraceFactory
  NotAllProfileIdsExist = 'not all given profile-ids exist',

  // Lensrace
  RaceAlreadyInitialized = 'already initialized',
  RaceGoalNotReached = 'goal not reached yet',
  RaceCanBeSettledOnInit = 'can be settled on init',
}
