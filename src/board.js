import Chess from 'chess.js';

export default function Board(fen) {

  const chess = new Chess();

  if (!fen) {
    chess.clear();
  } else {
    const valid = chess.load(fen);
    if (!valid) {
      throw new Error("bad fen string " + fen);
    }
  }

  this.chess = () => chess;
  this.fen = () => chess.fen();

  this.get = (square) => chess.get(square);

  this.put = (piece, square) => chess.put(piece, square);

  this.moves = (square) => {
    var other = {};
    const res = chess.moves({ square, verbose: true });
    return res.map(_ => _.to);
  };

  this.legals = () => {
    const res = chess.moves();
    return res;
  };

  this.isMate = () => {
    return chess.in_checkmate();
  };

  this.ascii = () => chess.ascii();

  this.clone = () => new Board(fen);

  this.apply = (move) => {
    var board = this.clone();
    board.chess().move(move);
    return board;
  };
}
