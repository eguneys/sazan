import { Tactics } from '../solvers';

import Combination from '../combination';

import { Continue, Terminate } from '../combination';

const SkewerSolver = (board) => {

  const attack = board => false;

  const filters = depth => board => {
    switch (depth) {
    case 0:
      return Terminate(attack(board));
    default:
      throw new Error("Unreachable depth");
    };
  };

  const mateCombination = new Combination(filters, board);
  mateCombination.Run();

  return Tactics.Skewer(mateCombination.lines());
};

export default SkewerSolver;
