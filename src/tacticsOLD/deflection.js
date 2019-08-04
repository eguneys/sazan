import Combination from '../combination';

import { Continue, Terminate, Defend } from '../combination';

import { Tactics2 } from '../solvers';

const DeflectionSolver = (tactic, board) => {
  const filters = depth => (board) => {
    const attack = attack => {
      let f7 = attack.get('f7');
      return f7 && f7.type === 'q';
    };

    const defense = defense => {
      let sequel = tactic.solver(defense, depth);
      return !sequel.solved();
    };

    switch (depth) {
    case 0:
      return Continue(attack(board));
    case 1:
      return Defend(defense(board));
    default: return Terminate(false);
    }
  };

  const combination = new Combination(filters, board);

  combination.Run();

  return Tactics2.Deflection(combination.lines());
};

export default DeflectionSolver;
