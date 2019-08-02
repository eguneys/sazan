import Board from './board';

import { TacticSolver, Tactic2Solver } from './solvers';

export default function Engine(fen) {

  this.board = new Board(fen);

  const solved = _ => _.solved();

  this.tactics = () => {
    const tactics = TacticSolver.solve(this.board);

    const tactics2 = tactics
          .filter(_ => _.hasIdea())
          .flatMap(_ => Tactic2Solver.solve(_, this.board));

    let res = [...tactics.filter(solved)];

    res = [...res, ...tactics2.filter(solved)];
    return res;
  };

}
