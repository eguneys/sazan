import Combination from '../combination';

import { Continue, Terminate } from '../combination';

import { Tactics2 } from '../solvers';

const RemovalOfDefenderSolver = (tactic, board) => {
  const filters = depth => (board) => {
    const attack = attack => {
      let f7 = attack.get('f7');
      return f7 && f7.type === 'q';
      return true;
    };

    const defense = defense => {
      let sequel = tactic.solver(defense, depth);
      return !sequel.solved();
    };

    const final = (final) => {
      let sequel = tactic.solver(final, depth);
      return sequel.solved();
    };


    switch (depth) {
    case 0:
      return Continue(attack(board));
    case 1:
      return Terminate(defense(board));
    case 2:
      return Terminate(final(board, before));
    default: return Terminate(false);
    }
  };

  const combination = new Combination(filters, board);

  combination.Run();

  return Tactics2.RemovalOfDefender(combination.lines(), 3);
};

export default RemovalOfDefenderSolver;
