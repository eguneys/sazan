import { SimpleTactic } from './tactics';
import { StrategicTactic } from './tactics';

import DeflectionSolver from './tactics/deflection';
import BackrankMateSolver from './tactics/backrankmate';
import ForcedMateSolver from './tactics/forcedmate';

import SkewerSolver from './tactics/skewer';

export const TacticSolver = {
  solve(board) {
    return TacticSolvers
      .flatMap(_ => _(board));
  }
};

export const Tactic2Solver = {
  solve(tactic, board) {
    return Tactic2Solvers
      .flatMap(_ => _(tactic, board));
  }
};

export const Tactic2Solvers = [
  DeflectionSolver
];

export const TacticSolvers = [
  SkewerSolver,
  BackrankMateSolver,
  ForcedMateSolver
];

export const Tactics = {
  BackrankMate(combination, ideas) {
    return new SimpleTactic('backrankMate', combination, 3, BackrankMateSolver, ideas);
  },
  ForcedMate(combination, ideas) {
    return new SimpleTactic('forcedMate', combination, 1, ForcedMateSolver, ideas);
  },
  Skewer(combination) {
    return new SimpleTactic('skewer', combination, 1, SkewerSolver);
  }
};

export const Tactics2 = {
  Deflection(combination) {
    return new StrategicTactic('deflection', combination, 1, DeflectionSolver);
  }
};
