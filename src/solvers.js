import { SimpleTactic } from './tactics';
import { StrategicTactic } from './tactics';

import RemovalOfDefenderSolver from './tactics/removalofdefender';
import BackrankMateSolver from './tactics/backrankmate';
import ForcedMateSolver from './tactics/forcedmate';

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
  RemovalOfDefenderSolver
];

export const TacticSolvers = [
  BackrankMateSolver,
  ForcedMateSolver
];

export const Tactics = {
  BackrankMate(combination, ideas = new Set()) {
    return new SimpleTactic('backrankMate', combination, 3, BackrankMateSolver, ideas);
  },
  ForcedMate(combination, ideas = new Set()) {
    return new SimpleTactic('forcedMate', combination, 1, ForcedMateSolver, ideas);
  }
};

export const Tactics2 = {
  RemovalOfDefender(combination, combo, sequel) {
    return new StrategicTactic('removalOfDefender', combination, combo, sequel, RemovalOfDefenderSolver);
  }
};
