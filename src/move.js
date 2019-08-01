export default function Move(uci, board) {
  
  this.uci = uci;
  this.board = board;

  this.after = board.apply(uci);

  this.toString = () => {
    return uci;
  };

}
