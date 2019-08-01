import Board from './board';

import { TacticSolver } from './tactics';

export default function Engine(fen) {

  this.board = new Board(fen);

  this.tactics = () => {
    return Object.keys(TacticSolver)
      .flatMap(_ => TacticSolver[_](this.board))
      .filter(_ => !!_);
  };

}
