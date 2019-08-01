import Board from './board';

import { TacticSolver } from './tactics';

export default function Engine(fen) {

  this.board = new Board(fen);

  this.tactics = () => {
    return TacticSolver.solve(this.board);
  };

}
