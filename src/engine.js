import Board from './board';

import { TacticSolver, Tactic2Solver } from './tactics';

export default function Engine(fen) {

  this.board = new Board(fen);

  const solved = _ => _.solved();

  this.tactics = () => {
    const tactics = TacticSolver.solve(this.board);

    const tactics2 = tactics
          .filter(_ => !_.solved)
          .map(_ => Tactic2Solver.solve(_, this.board));

    return [...tactics2.filter(solved),
            ...tactics.filter(solved)];
  };

}
