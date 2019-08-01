import { Tactics } from '../solvers';

import Combination from '../combination';

const ForcedMateSolver = (board) => {

  const ideas = new Set();

  const attack = depth => attack => attack.isMate();

  const mateCombination = new Combination(attack, board);
  mateCombination.Run();

  return Tactics.ForcedMate(mateCombination.lines(), ideas);
};

export default ForcedMateSolver;
