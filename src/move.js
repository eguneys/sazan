export default function Move(base, board) {
  
  this.base = base;
  this.board = board;

  this.uci = this.base.san;
  this.to = this.base.to;

  this.after = board.apply(this.uci);

  this.toString = () => {
    return this.uci;
  };

}
