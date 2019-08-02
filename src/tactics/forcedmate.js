import { Tactics } from '../solvers';

import Combination from '../combination';

import { Continue, Terminate } from '../combination';

const ForcedMateSolver = (board, startAtDepth) => {

  const ideas = new Set();

  const attack = attack => attack.isMate();

  const filters = depth => board => {
    return Terminate(attack(board));
  };

  const mateCombination = new Combination(filters, board, startAtDepth);
  mateCombination.Run();

  return Tactics.ForcedMate(mateCombination.lines());
};

export default ForcedMateSolver;
