import Board from './board';

import Combination from './combination';

export default function Engine(fen) {

  this.board = new Board(fen);

  this.findBestMove = () => {
    const combination = new Combination(this.board);
    combination.Run();

    return combination.lines();
  };

}
