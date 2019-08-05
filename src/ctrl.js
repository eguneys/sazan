import play from './play';
import Board from './board';

export default function ctrl(state, redraw) {
  this.data = state;

  this.data.move1 = makeMove(this.data.weights.w1);
  this.data.move2 = makeMove(this.data.weights.w2);

  var self = this;
  this.groundConfig = {
    fen: this.data.fen,
    movable: {
      color: 'white',
      events: {
        after(orig, dest) {
          setTimeout(() => {
            let fen = self.ground.getFen() + ' b - - 0 1',
                board = new Board(fen),
                p = play(board);

            const move = board.chess().move(p.best.uci);

            self.ground.move(move.from, move.to);
            self.ground.set({
              turnColor: 'white',

            });
            
            fen = self.ground.getFen() + ' w - - 0 1',
            board = new Board(fen),
            p = play(board);

            self.data.move1 = makeMove(p.best);
            self.data.move2 = makeMove(p.secondBest);
            redraw();
          }, 0);
        }
      }
    }
  };

  this.toggle = (node) => {
    node.collapsed = !node.collapsed;
    redraw();
  };

  function makeMove(m) {
    let root = m.w.json();

    richWeight(root);

    return {
      uci: m.uci,
      root
    };
  }

  function richWeight(node, depth = 0) {
    if (node.children) {
      for (var key in node.children) {
        richWeight(node.children[key], depth + 1);
      }
      node.collapsed = depth > 2;
    }

    return node;
  }
}
