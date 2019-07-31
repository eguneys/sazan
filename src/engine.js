import Board from './board';

import { Tactics } from './tactics';

export default function Engine(fen) {

  this.board = new Board(fen);

  this.tactics = () => {
    return Object.keys(Tactics)
      .flatMap(_ => Tactics[_](this.board))
      .filter(_ => !!_);
  };

}
